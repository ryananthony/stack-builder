var sb = require('../local_modules/stack-builder.js');

/*********************************
   GET / - Render the main view
 ********************************/

exports.index = function(req, res){
  res.render('index', { title: 'Texas Hold\'em Stack Builder' });
};

/******************************************
   POST to /build - Process jQuery Data
 *****************************************/

exports.getStack = function(req, res) {
	console.log('unmodified stack:');
	console.log(res.locals.chips);
	sb.distroChips(res.locals.chips.sort(sb.sortCount),res.locals.setup, function() {
		console.log('sorted by chip qty then distributed:');
		console.log(res.locals.chips);
		sb.setDenoms(res.locals.chips,res.locals.setup, function() { // with single chip submit got TypeError: Cannot set property 'denom' of undefined
			console.log('set the denominations:');
			console.log(res.locals.chips);
			console.log(res.locals.setup);
			if (sb.enoughValue(res.locals.chips,res.locals.setup)) {
				console.log('sorted desc:');
				var sorted = res.locals.chips.sort(sb.sortDenomDesc); 
				console.log(sorted);                                  
				sb.shaveChips(sorted, res.locals.setup, function() {
					console.log('validated total value:');              // 50-42-57 counts w/ 4 players
					console.log(sorted);																// still blowing up here...
					res.send(sorted.sort(sb.sortDenomAsc)); 
				});			
			} else {
				res.send(false);  //should render the homepage with an error if failure
			}                   //how do we check error?

		});
	});
};
