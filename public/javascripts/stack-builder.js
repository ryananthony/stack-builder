$(document).ready(function() {
	var chips = [];

	// prevent defineChip from submitting to server
	// instead, store values in 'chips' array
	$("#defineChip").submit(function () { 
		// console.log('submitted');

		//chips.push();
		var $postColor = $("select[name=color]").val(),
				$postDenom = $("select[name=denom]").val(),
				$postCount = $("input[name=count]").val();

		// console.log($postColor)
		// console.log($postDenom)
		// console.log($postCount)

		if (chips.length == 6) {
			alert('You have defined the max number of chips.')
			return false;
		}

		if (!$postCount) {
			alert('Please include how many of this chip you have (i.e. 50).')
			return false;
		}

		var chipImage = '<img src = "images/chips/' + $postColor + '/single.png"><br />';		

		// generate a prettified dollar amounts for the screen
		var chipValue = '$' + (parseInt($postDenom) / 100);								// round to 2 places
		var totalValue = '$' + ((parseInt($postDenom) / 100) * $postCount).toFixed(2);

		//console.log(chipValue.substring((chipValue.length -3),(chipValue.length -2)));

		// add zero if there's only 1 number after the decimal
		if ( (chipValue.search('.') != -1) && (chipValue.substring((chipValue.length -3),(chipValue.length -2)) != '.') ) {
			chipValue = chipValue + '0';
		}

		var newChip = {
			color: $postColor,
			denom: $postDenom,
			count: $postCount
		};

		chips.push(newChip);

		$('#chip' + (chips.length -1).toString()).html(chipImage + '<h4>' + $postCount + ' at ' + chipValue + 
																							'</h4><h3>For: ' + totalValue + '</h3>');

		console.log(newChip);
		console.log(chips);

		$('#collComplete').css('display','inline');

		return false; 
	}); // end of defineChip submit function


	$('#collComplete').click(function () { 
		$('#build').css('display','block');
		$('#addChipButton').css('display','none');
		$('#defineChip').css('display','none');
		$('#collComplete').css('display','none');
	});

	$("#build").submit(function () { 

		var $postStackType = $("select[name=stackType]").val(),
				$postBb = $("select[name=bb]").val(),
				$postPlayers = $("input[name=players]").val();

		$.post('/build', {chips : chips, stackType : $postStackType, bb : $postBb, players : $postPlayers} , function(data) {

			for (var chip in data.stack) {

				var imageStack = '';

				for (var i=0;i<data.stack[chip][2];i++) {
					if (data.stack[chip][2] === 1) {
						imageStack = '<img src = "images/chips/' + data.stack[chip][0] + '/single.png"><br />';
						break;
					}
					else if (i == 0) {
						imageStack = imageStack + '<img src = "images/chips/' + data.stack[chip][0] + '/top.png"><br />';
					}
					else if (i == (data.stack[chip][2] - 1)) {
						imageStack = imageStack + '<img src = "images/chips/' + data.stack[chip][0] + '/bottom.png"><br />';
					}
					else {
						imageStack = imageStack + '<img src = "images/chips/' + data.stack[chip][0] + '/middle.png"><br />';
					}
				}

				console.log(imageStack);

				$('#chip' + chip).empty();
				$('#chip' + chip).html(imageStack + '<h4>' + data.stack[chip][2] + ' at ' + data.stack[chip][1] + 
																							'</h4><h3>For: ' + data.stack[chip][3] + '</h3>');

			}

		})
		console.log('submit')
		return false;
	});


});