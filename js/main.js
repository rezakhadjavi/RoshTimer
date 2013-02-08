$(document).ready(function() {
	var currentTimeNode = $('.currentTime'),
		roshTimeNode = $('.roshCountdown'),
		roshStatsTimeNode = $('.statsTimer'),
		roshIsDeadNode = $('.btnRoshanDead'),
		whoKilledNode = $('.whoKilled'),
		dropdownNode = $('.dropdown');

	var isNegativeTime = true,
		killCounter = 0,
		isPaused = false,
		isCountingDown = false;

	var roshHP = 7500,
		roshDMG = 65,
		roshARMOR = 3;

	function globalTimeUp() {
		isNegativeTime = false;
		currentTimeNode.countdown('destroy');
		currentTimeNode.removeClass('negative');
		instantiateStatsTimer();
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
			until: +90, //1:30
			compact: true,
			format: 'MS',
			onExpiry: globalTimeUp,
			description: ''
		});
	}

	function roshRespawn() {
		whoKilledNode.hide();
		roshIsDeadNode.show().removeClass('disabled');
		roshTimeNode.countdown('destroy');
		roshTimeNode.text("10:00");
		roshTimeNode.addClass("blink");
		setTimeout(function(){
			roshTimeNode.removeClass("blink");
		}, 5000);
		isCountingDown = false;
	}

	function instantiateStatsTimer() {
		roshStatsTimeNode.countdown({
			since: +0,
			tickInterval: 300, //5:00
			onTick: updateRoshStats,
			compact: true,
			format: 'MS',
			description: ''
		});
	}

	function updateRoshStats(periods) {
		var minutes = Number(periods[5]);
		if (minutes <= 45 && minutes >= 5 && minutes % 5 === 0) {
			roshHP += 500;
			roshDMG += 10;
			roshARMOR += 0.5;
			$('.roshHP').text(roshHP);
			$('.roshDMG').text(roshDMG);
			$('.roshARMOR').text(roshARMOR);
		}
	}

	$('.btnRoshanDead, .roshCountdown').click(function(){
		if (!isCountingDown && !isPaused) {
			var row, currentTime;
			killCounter += 1;
			$(roshIsDeadNode).hide();
			whoKilledNode.show();
			roshTimeNode.countdown({
				until: '10m',
				compact: true,
				format: 'MS',
				onExpiry: roshRespawn,
				description: ''
			});
			roshTimeNode.removeClass("blink");
			currentTime = isNegativeTime ? "-" + currentTimeNode.text() : currentTimeNode.text();
			row = "<tr><td>" + killCounter + "</td><td>" + currentTime + "</td><td class='team_" + killCounter + "'></td><td>" + roshHP + "</td></tr>";
			$('.roshTable tbody').append(row);
			isCountingDown = true;
		}
	});

	$('.pauseToggle').click(function(){
		if (isPaused) {
			isPaused = false;
			$(this).removeClass('resume').addClass('pause');
			currentTimeNode.countdown('resume');
			roshTimeNode.countdown('resume');
			roshStatsTimeNode.countdown('resume');
			if (!isCountingDown)
				roshIsDeadNode.removeClass("disabled");
		} else {
			isPaused = true;
			$(this).removeClass('pause').addClass('resume');
			currentTimeNode.countdown('pause');
			roshTimeNode.countdown('pause');
			roshStatsTimeNode.countdown('pause');
			roshTimeNode.removeClass("blink");
			roshIsDeadNode.addClass("disabled");
		}
	});

	$('.whoKilled button').click(function(){
		var isRadiant = $(this).hasClass('radiant');
		whoKilledNode.hide();
		roshIsDeadNode.show().addClass('disabled');
		if (isRadiant) {
			$('.team_' + killCounter).text('Radiant');
		} else {
			$('.team_' + killCounter).text('Dire');
		}
	});

	$('.startGame').click(function(){
		$(this).parent().hide();
		$('.roshTimer').animate({
			width: 'toggle'
		}, 100, 'linear', function() {
			// Animation complete.
		});
		globalTimeDown();
	});

	$('body').click(function(e){
		if (dropdownNode.is(':visible')) {
			dropdownNode.hide();
			e.stopPropagation();
		}
	});

	$('.menu').click(function(){
		setTimeout(function(){
			if (dropdownNode.is(':visible')) {
				dropdownNode.hide();
			} else {
				dropdownNode.show();
			}
		}, 50);
	});

	$('.newGame').click(function(){
		isNegativeTime = true;
		killCounter = 0;
		isPaused = false;
		roshHP = 7500;
		roshDMG = 65;
		roshARMOR = 3;
		isCountingDown = false;

		$('.roshTimer').hide();
		dropdownNode.hide();
		$('.landing').animate({
			width: 'toggle'
		}, 350, 'linear', function() {
			// Animation complete.
		});

		$('.roshHP').text(roshHP);
		$('.roshDMG').text(roshDMG);
		$('.roshARMOR').text(roshARMOR);

		$('.pauseToggle').removeClass('resume').addClass('pause');

		currentTimeNode.countdown('resume');
		roshTimeNode.countdown('resume');
		roshStatsTimeNode.countdown('resume');
		currentTimeNode.countdown('destroy');
		roshTimeNode.countdown('destroy');
		roshStatsTimeNode.countdown('destroy');

		roshIsDeadNode.show().removeClass('disabled');
		roshTimeNode.text("10:00");

		$('.roshTable tbody tr').remove();

		whoKilledNode.hide();
		currentTimeNode.addClass('negative');
	});
});
