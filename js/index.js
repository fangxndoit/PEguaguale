var evt = "onorientationchange" in window ? "orientationchange" : "resize";
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}

function plusReady() {
	if(window.plus) {
		plus.screen.lockOrientation('landscape');
	}
}

window.addEventListener(evt, function() {
	console.log(evt);
	window.location.reload();
	var width = document.documentElement.clientWidth;
	var height = document.documentElement.clientHeight;

	$print = $('#print');

	if(width > height) {

		$print.width(width);
		$print.height(height);
		$print.css('top', 0);
		$print.css('left', 0);
		$print.css('transform', 'none');
		$print.css('transform-origin', '50% 50%');
	} else {
		$print.width(height);
		$print.height(width);
		$print.css('top', (height - width) / 2);
		$print.css('left', 0 - (height - width) / 2);
		$print.css('transform', 'rotate(90deg)');
		$print.css('transform-origin', '50% 50%');
	}

}, false);

$(function() {

	var width = document.documentElement.clientWidth;
	var height = document.documentElement.clientHeight;
	console.log(width);
	console.log(height);
	$print = $('#print');

	if(width < height) {

		$print.width(height);
		$print.height(width);
		$print.css('top', (height - width) / 2);
		$print.css('left', 0 - (height - width) / 2);
		$print.css('transform', 'rotate(90deg)');
		$print.css('transform-origin', '50% 50%');
	}
	//			
	//		console.log($('#nine'))
	//console.log(document.getElementById("nine").getElementsByTagName('canvas')[0]);

})