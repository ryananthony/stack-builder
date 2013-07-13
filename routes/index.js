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

exports.getStack = function(req, res){
	console.log('unmodified stack:');
	console.log(res.locals.chips);
	sb.distroChips(res.locals.chips.sort(sb.sortAsc),res.locals.setup, function() {
		console.log('sorted and distributed stack:');
		console.log(res.locals.chips);
		sb.setDenoms(res.locals.chips,res.locals.setup, function() { // with single chip submit got TypeError: Cannot set property 'denom' of undefined
			console.log('set the denominations:');
			console.log(res.locals.chips);
			sb.enoughValue(res.locals.chips,res.locals.setup, function() {
				// everything looks good at this point
				// [ { color: 'red', 		denom: 5, 	count: 7 },
				//   { color: 'red', 		denom: 10, 	count: 6 },
				//   { color: 'orange', denom: 25, 	count: 5 },
				//   { color: 'white', 	denom: 100, count: 5 },
				//   { color: 'purple', denom: 250, count: 4 } ]
				console.log('validated total value:');
				console.log(res.locals.chips);
				sb.shaveChips(res.locals.chips.sort(sb.sortDesc),res.locals.setup, function() {
					// sorting strangely right now... also breaking the count
					// [ { color: 'purple', denom: 250, count: 0 },
					//   { color: 'orange', denom: 25, 	count: 0 },
					//   { color: 'white', 	denom: 100, count: 0 },
					//   { color: 'red', 		denom: 10, 	count: 0 },
					//   { color: 'red', 		denom: 5, 	count: 2 } ]
					console.log('this is what we send to jQuery:');
					res.send(res.locals.chips);
				});
			});
		});
	});
}