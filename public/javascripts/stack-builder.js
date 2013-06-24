$(document).ready(function() {
	var chips = [];

	// prevent defineChip from submitting to server
	// instead, store values in 'chips' array
	$("#defineChip").submit(function () { 

		//chips.push();
		var $postColor = $("select").eq(0).val(),
				$postDenom = $("select").eq(1).val(),
				$postCount = $("input").eq(0).val();

		if (chips.length == 6) {
			alert('You have defined the max number of chips.')
			return false;
		}

		if (!$postCount) {
			alert('Please include how many of this chip you have (i.e. 50).')
			return false;
		}

		var imageStack = '';

		// create visual stack of chips based on 
		for (var i=0;i<$postCount;i++)
		{
			if (i == 0) 
			{
				imageStack = imageStack + '<img src = "images/chips/' + $postColor + '/top.png"><br />';
			}
			else if (i == ($postCount - 1)) 
			{
				imageStack = imageStack + '<img src = "images/chips/' + $postColor + '/bottom.png"><br />';
			}
			else
			{
				imageStack = imageStack + '<img src = "images/chips/' + $postColor + '/middle.png"><br />';
			}
		}
		

		// generate a prettified dollar amounts for the screen
		var chipValue = '$' + (parseInt($postDenom) / 100);								// round to 2 places
		var totalValue = '$' + ((parseInt($postDenom) / 100) * $postCount).toFixed(2);

		console.log(chipValue.substring((chipValue.length -3),(chipValue.length -2)));

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

		$('#chip' + chips.length.toString()).html(imageStack + '<h4>' + $postCount + ' at ' + chipValue + 
																							'</h4><h3>For: ' + totalValue + '</h3>');

		console.log(newChip);
		console.log(chips);

		$('#collComplete').css('display','inline');

		return false; 
	}); // end of defineChip submit function


	$('#collComplete').click(function () { 
		$('#build').css('display','block');
		$('#defineChip').css('display','none');
		$('#collComplete').css('display','none');
	});


});