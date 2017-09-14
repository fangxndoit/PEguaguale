var num, coinStatus = true;
var flag1 = true;
var flag2 = true;
var flag3 = true;
var flag4 = true;
var flag5 = true;
var flag6 = true;
var flag7 = true;
var flag8 = true;
var flag9 = true;
var flag10 = true;
var Ranum = "";
var wintext = getwinning();
console.log(wintext);

function Lottery(id, cover, coverType, width, height, drawPercentCallback) {
	this.conId = id;
	this.conNode = document.getElementById(this.conId);
	this.cover = cover;
	this.coverType = coverType;
	this.background = null;
	this.backCtx = null;
	this.mask = null;
	this.maskCtx = null;
	this.lottery = null;
	this.lotteryType = 'image';
	this.width = width || 300;
	this.height = height || 100;
	this.clientRect = null;
	this.drawPercentCallback = drawPercentCallback;

	//          this.status = false;
}

Lottery.prototype = {
	createElement: function(tagName, className) {
		var ele = document.createElement(tagName);
		ele.className = className;
		return ele;
	},
	getTransparentPercent: function(ctx, width, height) {
		var imgData = ctx.getImageData(0, 0, width, height),
			pixles = imgData.data,
			transPixs = [];
		for(var i = 0, j = pixles.length; i < j; i += 4) {
			var a = pixles[i + 3];
			if(a < 128) {
				transPixs.push(i);
			}
		}
		num = (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
		return(transPixs.length / (pixles.length / 4) * 100).toFixed(2);

	},
	resizeCanvas: function(canvas, width, height) {
		canvas.width = width;
		canvas.height = height;
		canvas.getContext('2d').clearRect(0, 0, width, height);
	},
	drawPoint: function(x, y) {
		//coinStatus = true;
		this.maskCtx.beginPath();
		var radgrad = this.maskCtx.createRadialGradient(x, y, 0, x, y, 30);
		radgrad.addColorStop(0, 'rgba(0,0,0,0.6)');
		radgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
		this.maskCtx.fillStyle = radgrad;
		this.maskCtx.arc(x, y, 30, 0, Math.PI * 2, true);
		this.maskCtx.fill();
		if(this.drawPercentCallback) {
			this.drawPercentCallback.call(null, this.getTransparentPercent(this.maskCtx, this.width, this.height));
		}

		//
		//console.log(num);

		//console.log('xx'+getwinning());			 

	},
	bindEvent: function() {
		var _this = this;
		var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
		var clickEvtName = device ? 'touchstart' : 'mousedown';
		var moveEvtName = device ? 'touchmove' : 'mousemove';
		if(!device) {
			var isMouseDown = false;
			document.addEventListener('mouseup', function(e) {
				isMouseDown = false;
			}, false);
		} else {
			document.addEventListener("touchmove", function(e) {
				if(isMouseDown) {
					e.preventDefault();
				}
			}, false);
			document.addEventListener('touchend', function(e) {
				isMouseDown = false;
			}, false);
		}
		this.mask.addEventListener(clickEvtName, function(e) {
			isMouseDown = true;
			var docEle = document.documentElement;
			if(!_this.clientRect) {
				_this.clientRect = {
					left: 0,
					top: 0
				};
			}
			var x = (device ? e.touches[0].clientX : e.clientX) - _this.clientRect.left + docEle.scrollLeft - docEle.clientLeft;
			var y = (device ? e.touches[0].clientY : e.clientY) - _this.clientRect.top + docEle.scrollTop - docEle.clientTop;
			_this.drawPoint(x, y);
		}, false);

		this.mask.addEventListener(moveEvtName, function(e) {
			if(!device && !isMouseDown) {
				return false;
			}
			var docEle = document.documentElement;
			if(!_this.clientRect) {
				_this.clientRect = {
					left: 0,
					top: 0
				};
			}
			var x = (device ? e.touches[0].clientX : e.clientX) - _this.clientRect.left + docEle.scrollLeft - docEle.clientLeft;
			var y = (device ? e.touches[0].clientY : e.clientY) - _this.clientRect.top + docEle.scrollTop - docEle.clientTop;
			_this.drawPoint(x, y);
		}, false);
	},
	drawLottery: function() {
		this.background = this.background || this.createElement('canvas', 'canvasclass');
		this.mask = this.mask || this.createElement('canvas', 'maskclass');

		if(!this.conNode.innerHTML.replace(/[\w\W]| /g, '')) {
			this.conNode.appendChild(this.background);
			this.conNode.appendChild(this.mask);
			this.clientRect = this.conNode ? this.conNode.getBoundingClientRect() : null;
			this.bindEvent();
		}

		this.backCtx = this.backCtx || this.background.getContext('2d');
		this.maskCtx = this.maskCtx || this.mask.getContext('2d');

		if(this.lotteryType == 'image') {
			var image = new Image(),
				_this = this;
			image.onload = function() {
				_this.drawMask();		
					_this.width = this.width;
					_this.height = this.height;
					_this.resizeCanvas(_this.background, this.width, this.height);
					_this.backCtx.drawImage(this, 0, 0);
				
				
			}
			image.src = this.lottery;
		} else if(this.lotteryType == 'text') {
			this.drawMask();
			
				this.width = this.width;
				this.height = this.height;
				this.resizeCanvas(this.background, this.width, this.height);
				this.backCtx.save();
				this.backCtx.fillStyle = '#FFF';
				this.backCtx.fillRect(0, 0, this.width, this.height);
				this.backCtx.restore();
				this.backCtx.save();
				var fontSize = 30;
				this.backCtx.font = 'Bold ' + fontSize + 'px Arial';
				this.backCtx.textAlign = 'center';
				this.backCtx.fillStyle = '#CCC';
				this.backCtx.fillText(this.lottery, this.width / 2, this.height / 2 + fontSize / 2);
				this.backCtx.restore();
			
			
			
		}
	},
	drawMask: function() {
		this.resizeCanvas(this.mask, this.width, this.height);
		if(this.coverType == 'color') {
			this.maskCtx.fillStyle = this.cover;
			this.maskCtx.fillRect(0, 0, this.width, this.height);
			this.maskCtx.globalCompositeOperation = 'destination-out';
		} else if(this.coverType == 'image') {
			var image = new Image(),
				_this = this;
			image.onload = function() {
				_this.maskCtx.drawImage(this, 0, 0);
				_this.maskCtx.globalCompositeOperation = 'destination-out';
			}
			image.src = this.cover;
		}
	},
	init: function(lottery, lotteryType) {
		this.lottery = lottery;
		this.lotteryType = lotteryType || 'image';
		this.drawLottery();
	}
}

window.onload = function() {
	var n=0;
	addcanvas();

	//点击事件
	$('#btn1').click(function() {
		$('#btn1').hide();
		$('.maskclass').fadeOut(500);
		setTimeout(function() {
			goldrain();
			
		}, 800)
		$('#btn2').show();
		$('#btn3').hide();
	})
	$('#btn2').click(function() {
		$('#btn1').show();
		$('canvas').remove();
		addcanvas();
		playaudion();
		$('#btn1').removeAttr('disabled');
		MathRand();
		
		$('#luckynum span').html('NO.'+ Ranum);
		Ranum = '';
		$('#btn2').hide();
		$('#btn3').show();
	})
	$('#btn3').click(function() {
		$('#btn1').show();
		$('canvas').remove();
		addcanvas();
		playaudion();
		$('#btn1').removeAttr('disabled');
		MathRand();
		
		$('#luckynum span').html('NO.'+ Ranum);
		Ranum = '';
	})
	$('#game').click(function(){
		$('#gamerule').show(200);
	})
	$('#close').click(function(){
		$('#gamerule').hide(200);
	})

	function drawPercent1(percent) {

		//drawPercentNode.innerHTML = percent + '%';
		//console.log(percent);
		if(percent > 90) {
			
			if(flag1) {

				goldrain();
				flag1 = false;
				console.log(flag1);
			}
			//coinStatus = true;
		}
	}

	function drawPercent2(percent) {
		if(percent > 90) {
			if(flag2) {
				console.log('xxx');
				goldrain();
				flag2 = false;
				console.log(flag2);
			}
		}
	}

	function drawPercent3(percent) {
		if(percent > 90) {
			if(flag3) {
				console.log('xxx');
				goldrain();
				flag3 = false;
				console.log(flag3);
			}
		}
	}

	function drawPercent4(percent) {
		if(percent > 90) {
			if(flag4) {
				console.log('xxx');
				goldrain();
				flag4 = false;
				console.log(flag4);
			}
		}
	}

	function drawPercent5(percent) {
		if(percent > 90) {
			if(flag5) {
				console.log('xxx');
				goldrain();
				flag5 = false;
				console.log(flag5);
			}
		}
	}

	function drawPercent6(percent) {
		if(percent > 90) {
			if(flag6) {
				console.log('xxx');
				goldrain();
				flag6 = false;
				console.log(flag6);
			}
		}
	}

	function drawPercent7(percent) {
		if(percent > 90) {
			if(flag7) {
				console.log('xxx');
				goldrain();
				flag7 = false;
				console.log(flag7);
			}
		}
	}

	function drawPercent8(percent) {
		if(percent > 90) {
			if(flag8) {
				console.log('xxx');
				goldrain();
				flag8 = false;
				console.log(flag8);
			}
		}
	}

	function drawPercent9(percent) {
		if(percent > 90) {
			if(flag9) {
				console.log('xxx');
				goldrain();
				flag9 = false;
				console.log(flag9);
			}
		}
	}

	function drawPercent10(percent) {
		if(percent > 90) {
			if(flag10) {
				console.log('xxx');
				goldrain();
				flag10 = false;
				console.log(flag10);
			}
		}
	}

	function addcanvas() {
		var lottery1 = new Lottery('one', 'img/ball.png', 'image', 72.5, 86.5, drawPercent1);
			lottery1.init('img/one.png', 'image');
		var lottery2 = new Lottery('two', 'img/ball.png', 'image', 72.5, 86.5, drawPercent2);
			lottery2.init('img/two.png', 'image');
		var lottery3 = new Lottery('three', 'img/ball.png', 'image', 72.5, 86.5, drawPercent3);
			lottery3.init('img/three.png', 'image');
		var lottery4 = new Lottery('four', 'img/ball.png', 'image', 72.5, 86.5, drawPercent4);
			lottery4.init('img/four.png', 'image');
		var lottery5 = new Lottery('five', 'img/ball.png', 'image', 72.5, 86.5, drawPercent5);
			lottery5.init('img/five.png', 'image');
		var lottery6 = new Lottery('six', 'img/ball.png', 'image', 72.5, 86.5, drawPercent6);
			lottery6.init('img/six.png', 'image');
		var lottery7 = new Lottery('seven', 'img/ball.png', 'image', 72.5, 86.5, drawPercent7);
			lottery7.init('img/seven.png', 'image');
		var lottery8 = new Lottery('eight', 'img/ball.png', 'image', 72.5, 86.5, drawPercent8);
			lottery8.init('img/eight.png', 'image');
		var lottery9 = new Lottery('nine', 'img/nine_icon.png', 'image', 65, 64, drawPercent9);
			lottery9.init('img/nine.png', 'image');
			$('#nine').children().removeClass('canvasclass').addClass('nineclass');
		var lottery10 = new Lottery('ten', 'img/ten_icon.png', 'image', 125, 70, drawPercent10);
			lottery10.init('img/ten.png', 'image');
			$('#ten').children().removeClass('canvasclass').addClass('tenclass');
		flag1 = true;
		flag2 = true;
		flag3 = true;
		flag4 = true;
		flag5 = true;
		flag6 = true;
		flag7 = true;
		flag8 = true;
		flag9 = true;
		flag10 = true;
	}

	function playaudion() {
		var myaudio = document.getElementById("myaudio");
		if(myaudio.paused) {
			myaudio.play();
		} else {
			myaudio.pause();
		}

	}

	function recanvas() {
		$('.maskclass').fadeOut(200);
		$('#btn1').hide();
		setTimeout(function() {
			goldrain();

		}, 800)
		$('#btn2').show();
		$('#btn3').hide();
	}

	function MathRand() {
		
		for(var i = 0; i < 5; i++) {
			Ranum += Math.floor(Math.random() * 10);
		}
		
	}
}

function getRandomStr(len) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for(var i = 0; i < len; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

function getwinning() {
	//console.log(Math.random());
	var text = '';

	var mrandom = Math.floor(Math.random() * 2);
	console.log(mrandom);
	if(mrandom == 0) {
		text = '中奖了';
	} else {
		text = '谢谢参与';
	}
	return text;
}

function goldrain() {
	//关闭中奖
	setTimeout(function() {
		$('#win').fadeOut(500);
	}, 5000)
	setTimeout(function() {
		$('#win').fadeIn(1000);
	}, 500)
	var coin = new Coin();
	/*//调用
	var time1 = setInterval(function() {
		var coin = new Coin(); //调用
		console.info('gsddsdssd');	
	}, 1000);
	var time2 = setTimeout(function() {
		clearInterval(time1);
		clearTimeout(time2);
	}, 2000);
*/
	$('#win').click(function() {
		$('#win').fadeOut(1000);
	})

	/*var opa=1;
	var timer=setInterval(function(){
		$('#win').css('opacity',opa);
		opa-=0.1;
		if(opa<-0.05){
			clearInterval(timer);
		}
	},200);*/
	var total = Number($('#money').text());
	var timemoney = setInterval(function() {
		total += 10;
		//console.log(total);
		$('#money').html(total);
	}, 100);
	setTimeout(function() {
		clearInterval(timemoney);
		//$('#money').innerHTML = 2000;
		console.log('计时器' + total)
	}, 5000)

	var winmoney = Number($('#number').text());
	var timenum = setInterval(function() {
		winmoney += 0.01;
		//console.log(total);
		var foo = parseFloat(winmoney).toFixed(2);
		//console.log('浮点数: ' + foo);
		$('#number').html(foo);
	}, 100);
	setTimeout(function() {
		clearInterval(timenum);
		//$('#money').innerHTML = 2000;
		console.log('计时器' + winmoney)
	}, 4000)
}