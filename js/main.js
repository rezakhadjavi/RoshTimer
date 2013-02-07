$(document).ready(function() {
	var currentTimeNode = $('.currentTime'),
		roshTimeNode = $('.roshCountdown'),
		roshIsDeadNode = $('.btnRoshanDead'),
		whoKilledNode = $('.whoKilled');

	var isNegativeTime = true,
		killCounter = 0,
		isPaused = false;

	var roshHP = 7500,
		roshDMG = 65,
		roshARMOR = 3;

	var init = function() {
		whoKilledNode.hide();
		currentTimeNode.addClass('negative');
	};

	init();

	function globalTimeUp() {
		isNegativeTime = false;
		currentTimeNode.countdown('destroy');
		currentTimeNode.removeClass('negative');
		setTimeout(function() {
			currentTimeNode.countdown({
				since: +0,
				compact: true,
				format: 'MS',
				description: ''
			});
		}, 50);
	}

	function globalTimeDown() {
		currentTimeNode.countdown({
			until: +90,
			compact: true,
			format: 'MS',
			onExpiry: globalTimeUp,
			description: ''
		});
	}

	function roshRespawn() {
		whoKilledNode.hide();
		roshIsDeadNode.show();
		roshTimeNode.countdown('destroy');
		roshTimeNode.text("10:00");
	}

	roshIsDeadNode.click(function(){
		var row, currentTime;
		killCounter += 1;
		$(this).hide();
		whoKilledNode.show();
		roshTimeNode.countdown({
			until: '10m',
			compact: true,
			format: 'MS',
			onExpiry: roshRespawn,
			description: ''
		});

		currentTime = isNegativeTime ? "-" + currentTimeNode.text() : currentTimeNode.text();
		row = "<tr><td>" + killCounter + "</td><td>" + currentTime + "</td><td class='team_" + killCounter + "'></td><td>" + roshHP + "</td></tr>";
		$('.roshTable tbody').append(row);
	});

	$('.pauseToggle').click(function(){
		if (isPaused) {
			isPaused = false;
			$(this).removeClass('resume').addClass('pause');
			currentTimeNode.countdown('resume');
			roshTimeNode.countdown('resume');
			roshIsDeadNode.removeAttr('disabled');
		} else {
			isPaused = true;
			$(this).removeClass('pause').addClass('resume');
			currentTimeNode.countdown('pause');
			roshTimeNode.countdown('pause');
			roshIsDeadNode.attr('disabled', 'disabled');
		}
	});

	$('.whoKilled button').click(function(){
		var isRadiant = $(this).hasClass('radiant');
		whoKilledNode.hide();

		if (isRadiant) {
			$('.team_' + killCounter).text('Radiant');
		} else {
			$('.team_' + killCounter).text('Dire');
		}
	});

	$('.startGame').click(function(){
		$(this).parent().hide();
		$('.roshTimer').show();
		globalTimeDown();
	});

	$('.newGame').click(function(){
		isNegativeTime = true;
		killCounter = 0;
		isPaused = false;

		$('.roshTimer').hide();
		$('.landing').show();

		$('.pauseToggle').removeClass('resume').addClass('pause');

		currentTimeNode.countdown('resume');
		roshTimeNode.countdown('resume');
		currentTimeNode.countdown('destroy');
		roshTimeNode.countdown('destroy');

		roshIsDeadNode.removeAttr('disabled');
		roshIsDeadNode.show();
		roshTimeNode.text("10:00");

		$('.roshTable tbody tr').remove();

		init();
	});
});
