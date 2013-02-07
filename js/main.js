$(document).ready(function() {
	var currentTimeNode = $('.currentTime'),
		roshTimeNode = $('.roshCountdown'),
		roshStatsTimeNode = $('.statsTimer'),
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
		roshIsDeadNode.show();
		roshTimeNode.countdown('destroy');
		roshTimeNode.text("10:00");
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
		if (minutes >= 5 && minutes % 5 === 0 && minutes <= 45) {
			roshHP += 500;
			roshDMG += 10;
			roshARMOR += 0.5;
			$('.roshHP').text(roshHP);
			$('.roshDMG').text(roshDMG);
			$('.roshARMOR').text(roshARMOR);
		}
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

	$('.pause').click(function(){
		if (isPaused) {
			isPaused = false;
			$(this).text('Pause');
			currentTimeNode.countdown('resume');
			roshTimeNode.countdown('resume');
			roshStatsTimeNode.countdown('resume');
			roshIsDeadNode.removeAttr('disabled');
		} else {
			isPaused = true;
			$(this).text('Resume');
			currentTimeNode.countdown('pause');
			roshTimeNode.countdown('pause');
			roshStatsTimeNode.countdown('pause');
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
		roshHP = 7500;
		roshDMG = 65;
		roshARMOR = 3;

		$('.roshTimer').hide();
		$('.landing').show();

		$('.pause').text("Pause");
		$('.roshHP').text(roshHP);
		$('.roshDMG').text(roshDMG);
		$('.roshARMOR').text(roshARMOR);

		currentTimeNode.countdown('resume');
		roshTimeNode.countdown('resume');
		roshStatsTimeNode.countdown('resume');
		currentTimeNode.countdown('destroy');
		roshTimeNode.countdown('destroy');
		roshStatsTimeNode.countdown('destroy');

		roshIsDeadNode.removeAttr('disabled');
		roshIsDeadNode.show();
		roshTimeNode.text("10:00");

		$('.roshTable tbody tr').remove();

		init();
	});
});
