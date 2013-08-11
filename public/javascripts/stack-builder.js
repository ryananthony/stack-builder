$(document).ready(function() {
	var chips = [];

	// prevent defineChip from submitting to server
	// instead, store values in 'chips' array
	$("#defineChip").submit(function () { 
		// console.log('submitted');

		//chips.push();
		var $postColor = $("select[name=color]").val(),
				$postDenom = 0, // legacy $("select[name=denom]").val(),
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

		var newChip = {
			color: $postColor,
			denom: $postDenom,
			count: $postCount
		};

		chips.push(newChip);

		if (chips.length < 3) {
			$('#chipsNeeded').html('<center><h4>Please add ' + (3 - chips.length) + ' more chips to your collection.</h4></center><br />');
		} else {
			$('#chipsNeeded').css('display','none');
		}

		$('#chip' + (chips.length -1).toString()).html(chipImage + '<h3>Count: ' + $postCount + '</h3>');

		console.log(newChip);
		console.log(chips);

		if (chips.length > 2) {
			$('#collComplete').css('display','inline');
		}

		$('#addChip').popup('close');

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

		var chipMinimum = 30.
				maxChipsPossible = 0;

		for (var chip in chips) {
			maxChipsPossible = maxChipsPossible + parseInt(chips[chip].count);
		}

		console.log('total possible = ' + maxChipsPossible);

		if ( (maxChipsPossible / parseInt($postPlayers)) < chipMinimum) {
			alert('You will need more chips for ' + $postPlayers + ' players.');
			return false;
		}

		$.post('/build', {chips : chips, setup : { stackType : $postStackType, bb : $postBb, players : $postPlayers} } , function(data) {

			console.log(data);

			for (var chip in data) {

				var imageStack = '';

				for (var i=0;i<data[chip].count;i++) {
					if (data[chip].count === 1) {
						imageStack = '<img src = "images/chips/' + data[chip].color + '/single.png"><br />';
						break;
					}
					else if (i == 0) {
						imageStack = imageStack + '<img src = "images/chips/' + data[chip].color + '/top.png"><br />';
					}
					else if (i == (data[chip].count - 1)) {
						imageStack = imageStack + '<img src = "images/chips/' + data[chip].color + '/bottom.png"><br />';
					}
					else {
						imageStack = imageStack + '<img src = "images/chips/' + data[chip].color + '/middle.png"><br />';
					}
				}

				console.log(imageStack);

				$('#chip' + chip).empty();
				$('#chip' + chip).html(imageStack + '<h4>' + data[chip].count + ' at ' + data[chip].denom + 
																'</h4><h3>For: ' + (data[chip].denom * data[chip].count)  + '</h3>');

			}

		})
		console.log('submit')
		$('#build').css('display','none');
		return false;
	});


});