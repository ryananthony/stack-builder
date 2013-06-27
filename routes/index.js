
/*
 * GET / and POST to /build.
 */


var maxChips = function (chipColor, chipValue, numChips, numPlayers) {
	var playerChips;
	var totalValue;

	console.log(chipColor, chipValue, numChips, numPlayers)
	// return 0 if there are not enough of this chip
	if (numPlayers > numChips) {
		return [0,0];
	};

	// subtract remaining chips from numChips for maxDistro
	// do not seem to need floor (integer division)
	playerChips = (numChips - (numChips % numPlayers)) / numPlayers;
	totalValue = playerChips * chipValue;

	console.log(chipValue, playerChips, totalValue)
	return [chipColor, chipValue, playerChips, totalValue];
};

// Takes BB value, stackSize then any number of chipArrays
var stackBuilder = function (bb, stackType, chipsArray) {
	// first arg is big blind so we can determine value
	//var bb = arguments[0];
	var totalValue = 0;
	var sortedStack = [];
	var fullStack;
	var maxValue;
	var deltaValue;
	var badTotal = 0;

	// Set fullStack based on 2nd arg (stackType): 
	// SHORT, STANDARD, or DEEP.
	switch (arguments[1]) {
		case 0:
			fullStack = parseInt(bb * 50);
			break;
		case 1:
			fullStack = parseInt(bb * 100);
			break;
		case 2:
			fullStack = parseInt(bb * 150);
			break;
	};
  
  console.log('\n*****************START********************\n')

		for (var i in chipsArray) {
				console.log('chipsArray[' + (i) + '] contains: ' + chipsArray[i]);
		}

	// Get the MAX value...
	maxValue = 0;
	for (var i in chipsArray) {
			if (maxValue < chipsArray[i][1]) {
				maxValue = chipsArray[i][1]
			}
	}

	// then insert it into the sortedStack.
	for (var i in chipsArray) {
			if (maxValue == chipsArray[i][1]) {
				sortedStack.push(chipsArray[i]);
			}
	}

	//DEBUG console.log('max: ' + maxValue)

	for (var i in chipsArray) {
				// sort the chips DESCENDING by denomination
				for (var sortedChip in sortedStack) {

					if (maxValue == chipsArray[i][1]) {
						break;
					}

					if (chipsArray[i][1] > sortedStack[sortedChip][0]) {
						sortedStack.splice((sortedChip), 0, chipsArray[i]);
						//sortedStack.unshift(arguments[chip]);
						//DEBUG console.log('appending to beginning ' + arguments[chip])
						break;
					}
					else if ((sortedStack.length - 1) == sortedChip)
					{
						
						sortedStack.push(chipsArray[i]);
						//DEBUG console.log('appending to end '+ (sortedChip + 1) + ':' + arguments[chip])
						break;

					}
					else 
					{
						continue;
					}
				}
			totalValue = totalValue + chipsArray[i][3];
	};
		console.log('\nSorted Stack:')
		for (var i in sortedStack) {
			console.log('sortedStack[' + i + '] contains: ' + sortedStack[i]);
		}

	//DEBUG console.log(sortedStack)

	if (totalValue < fullStack) {
		console.log('not enough chips to play')
	}
	else // we have enough chips, now we need to decrement
	{
		// verify the largest chip value is more
		// than half the expected full stack size.
		if ((fullStack - sortedStack[2]) > (fullStack / 2)) {
			// dunno if we'll do this
		}


		deltaValue = totalValue;
		// 1. count chips minus 1 of biggest chip
		while (deltaValue != fullStack) {

			for (var sortedChip in sortedStack) {
				// 2. compare new stack value to fullStack
				// 2a. if new stack still bigger, commit
				if ((deltaValue - sortedStack[sortedChip][0]) > fullStack) 
				{
					// maybe one more conditional here to check the number
					// of chips left compared to others so we don't remove
					// too many of a particular chip...?

					sortedStack[sortedChip][1] = sortedStack[sortedChip][1] - 1;
					sortedStack[sortedChip][2] = sortedStack[sortedChip][0] * sortedStack[sortedChip][1];
					deltaValue = deltaValue - sortedStack[sortedChip][0];

					
					// for (var denom in sortedStack) {
					// 	DEBUG console.log('sortedStack[' + denom + '] contains: ' + sortedStack[denom]);
					// }
					console.log('Delta value is: ' + deltaValue)
					break; // pushes back to beginning of sortedStack
								 // so we get rid of the bigest chips first
				}

				// need to check if we're getting close, 
				// then get more diligent about the value
				if ((deltaValue - fullStack) <= bb) {
					for (var denom in sortedStack) {
						//console.log('getting here')
						//console.log((deltaValue - fullStack))
						//console.log(sortedStack[denom][0])
						if ((deltaValue - fullStack) == sortedStack[denom][0]) {
							//console.log('what about here')

							sortedStack[denom][1] = sortedStack[denom][1] - 1;
							sortedStack[denom][2] = sortedStack[denom][0] * sortedStack[denom][1];
							deltaValue = deltaValue - sortedStack[denom][0];
							break;						
						}
					}
				}

			}
			console.log(deltaValue)
			if (badTotal > 100) {
				break;
			}
			badTotal++;
			//console.log('infinite: ' + l)

		}

		
		
				
				// 2b. if new stack smaller, cancel and move to next
								// biggest chip
				// 3b. if new stack equal, we're done.


		console.log('Value of stack: ' + totalValue);
		console.log('Value of a full Stack: ' + fullStack);
		for (var denom in sortedStack) {
			console.log('sortedStack[' + denom + '] contains: ' + sortedStack[denom]);
		}
				
	}

	console.log('\n*****************FINISH********************\n')

	return sortedStack;

}

exports.index = function(req, res){
  res.render('index', { title: 'Texas Hold\'em Stack Builder' });
};

exports.getStack = function(req, res){

	var maxDenoms = [];
	for (var i in res.locals.chips) {
																											// must pass as INTs otherwise function does string comparison
		maxDenoms.push(maxChips(res.locals.chips[i].color, parseInt(res.locals.chips[i].denom), parseInt(res.locals.chips[i].count), parseInt(res.locals.players)));
		// value returned: chipColor, chipValue, playerChips, totalValue
	}

	var stack = stackBuilder(res.locals.bb, res.locals.stackType, maxDenoms);

	console.log(stack);

  res.send({stack: stack});
};