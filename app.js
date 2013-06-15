
var maxChips = function (chipValue, numChips, numPlayers) {
	var playerChips;
	var totalValue;
	// return 0 if there are not enough of this chip
	if (numPlayers > numChips) {
		return [0,0];
	};

	// subtract remaining chips from numChips for maxDistro
	// do not seem to need floor (integer division)
	playerChips = (numChips - (numChips % numPlayers)) / numPlayers;
	totalValue = playerChips * chipValue;

	//DEBUG console.log(chipValue, playerChips, totalValue)
	return [chipValue, playerChips, totalValue];
};

// Takes BB value, stackSize then any number of chipArrays
var stackBuilder = function () {
	// first arg is big blind so we can determine value
	var bb = arguments[0];
	var totalValue = 0;
	var sortedStack = [];
	var fullStack;
	var maxValue;
	var deltaValue;

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

		for (var denom in arguments) {
			if (denom >= 2) {
				console.log('arguments[' + (denom) + '] contains: ' + arguments[denom]);
			}	
		}

	// Get the MAX value...
	maxValue = 0;
	for (var i in arguments) {
		if (i >= 2) {
			if (maxValue < arguments[i][0]) {
				maxValue = arguments[i][0]
			}
		}
	}

	// then insert it into the sortedStack.
	for (var i in arguments) {
		if (i >= 2) {
			if (maxValue == arguments[i][0]) {
				sortedStack.push(arguments[i]);
			}
		}
	}

	//DEBUG console.log('max: ' + maxValue)

	for (var chip in arguments) {
		if (chip > 1) {
			if (chip >= 2) {

				// sort the chips DESCENDING by denomination
				for (var sortedChip in sortedStack) {

					if (maxValue == arguments[chip][0]) {
						break;
					}

					if (arguments[chip][0] > sortedStack[sortedChip][0]) {
						sortedStack.splice((sortedChip), 0, arguments[chip]);
						//sortedStack.unshift(arguments[chip]);
						//DEBUG console.log('appending to beginning ' + arguments[chip])
						break;
					}
					else if ((sortedStack.length - 1) == sortedChip)
					{
						
						sortedStack.push(arguments[chip]);
						//DEBUG console.log('appending to end '+ (sortedChip + 1) + ':' + arguments[chip])
						break;

					}
					else 
					{
						continue;
					}
				}
			}
			totalValue = totalValue + arguments[chip][2];
		};
	};
		console.log('\nSorted Stack:')
		for (var denom in sortedStack) {
			console.log('sortedStack[' + denom + '] contains: ' + sortedStack[denom]);
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

		}

		console.log(deltaValue)
		
				
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

	return sortedStack

}


// TESTS/EXAMPLES
var chip1 = maxChips(5, 100, 9);
//console.log('VALUE: 5 | QTY: 50 | PLAYERS: 9 \nEach player gets ' + chip1[1] + ' of value ' + chip1[0] + ' chips for total value of ' + chip1[2]);

var chip2 = maxChips(10, 70, 9);
//console.log('VALUE: 10 | QTY: 70 | PLAYERS: 9 \nEach player gets ' + chip2[1] + ' of value ' + chip2[0] + ' chips for total value of ' + chip2[2]);

var chip3 = maxChips(25, 30, 9);
//console.log('VALUE: 25 | QTY: 30 | PLAYERS: 9 \nEach player gets ' + chip3[1] + ' of value ' + chip3[0] + ' chips for total value of ' + chip3[2]);

var chip4 = maxChips(50, 40, 9);
//console.log('VALUE: 100 | QTY: 40 | PLAYERS: 9 \nEach player gets ' + chip4[1] + ' of value ' + chip4[0] + ' chips for total value of ' + chip4[2]);

var chip5 = maxChips(100, 50, 9);
//console.log('VALUE: 100 | QTY: 50 | PLAYERS: 9 \nEach player gets ' + chip5[1] + ' of value ' + chip5[0] + ' chips for total value of ' + chip5[2]);

var chip6 = maxChips(500, 30, 9);
//console.log('VALUE: 500 | QTY: 30 | PLAYERS: 9 \nEach player gets ' + chip6[1] + ' of value ' + chip6[0] + ' chips for total value of ' + chip6[2]);

console.log(maxChips(100, 50, 9))
// Should not be enough chips
//stackBuilder(10, 2, chip1, chip2, chip3, chip4);
//stackBuilder(10, 2, chip1, chip2, chip3, chip4, chip5);

// Value passed in is 2400, needs to decrement
//stackBuilder(10, 2, chip1, chip2, chip3, chip4, chip5, chip6);

// Mixed up chip order to test sorting
//stackBuilder(10, 2, chip4, chip3, chip1, chip2, chip6, chip5);

// standard stack size
var stack1 = stackBuilder(10, 1, chip4, chip3, chip1, chip2, chip6, chip5);

// short stack size
var stack2 = stackBuilder(10, 0, chip4, chip3, chip1, chip2, chip6, chip5);

console.log(stack1)

console.log(stack2)