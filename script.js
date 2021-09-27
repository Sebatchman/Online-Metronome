const button = document.getElementsByClassName('btn')[0];
const minusBPMes = document.getElementsByClassName('minus-bpMes')[0];
const plusBPMes = document.getElementsByClassName('plus-bpMes')[0];
const inputMes = document.getElementsByClassName('bpMes')[0];
const input = document.getElementById('tempo');
const icon = document.getElementById('play-button-icon');
const plusBtn = document.getElementById('rightBtn');
const minusBtn = document.getElementById('leftBtn');
const coconut1 = document.getElementsByClassName('coconut1')[0];
const coconut2 = document.getElementsByClassName('coconut2')[0];

let click1 = new Audio('beat-sound.wav');
let click2 = new Audio('bar-sound.wav');

let btnLeft = 0;
let isPaused = true;
let isRunning = false;
let beatsPerMeasure = 4;
let count = 0;
let buttonXOnMouseDown = 0;
let dragValue = null;
let buttonLeftOffset = 0;
let didDrag = false;
let lastBpmBeforeReset = 180;
let initialCoconutPosition = 189;
let coconutPosition = initialCoconutPosition;
let opacity = 0;
let intervalID = null;
let coconut = null;
let didDropNut1 = false;
let didDropNut2 = false;


function Timer(callback, timeInterval, options) {
	this.timeout = null;
	this.timeInterval = timeInterval;
	this.immediate = options.immediate;
	this.start = () => {
		this.expected = Date.now() + this.timeInterval;
			this.theTimeout = null;
				if (this.immediate) {
					callback();
				}
			this.timeout = setTimeout(this.round, this.timeInterval);
		console.log('Started');
	}
	this.stop = () => {
		clearTimeout(this.timeout);
		this.timeout = null;
		console.log('Stopped');
	}
	this.round = () => {
		let drift = Date.now() - this.expected;
		if (drift > this.timeInterval) {
			if (options.errorCallBack) {
				options.errorCallBack();
			}
		}
		callback();
			this.expected += this.timeInterval;
		console.log(drift);
		console.log(this.timeInterval - drift);
			this.timeout = setTimeout(this.round, this.timeInterval - drift);
	}
	this.isStarted = () => {
		return this.timeout != null;
	}
}

const dragButton = (id) => {
	button.style.position = 'relative';
	button.onmousedown = function(e) {
		dragValue = button;
		buttonXOnMouseDown = e.pageX;
		buttonLeftOffset = Number(dragValue.style.left.split('px')[0]);
		lastBpmBeforeReset = input.value;
		didDrag = false;
	}
}
document.onmouseup = function(e) {
	dragValue = null;
}
document.onmousemove = function(e) {
	if (dragValue == null) {
		return;
	}
	let x = e.pageX;
	let delta = x - buttonXOnMouseDown;
	let dragDistance = buttonLeftOffset + delta;
	dragDistance = Math.max(-330, dragDistance);
	dragDistance = Math.min(330, dragDistance);
	dragValue.style.left = dragDistance + 'px';
	input.value = 180 + Math.round(dragDistance / 2);
	btnLeft = dragDistance;
	didDrag = true;
	metronome.timeInterval = 60000 / input.value;


	const currentBpm = input.value;
	if (currentBpm - lastBpmBeforeReset > 50 &&
		lastBpmBeforeReset < 80 &&
		isRunning) {
		metronome.stop();
		metronome.start();
		lastBpmBeforeReset = input.value;
	}
	maybeShowCoconutEasterEgg(currentBpm);
}

const maybeShowCoconutEasterEgg = (currentBpm) => {
	if (currentBpm < 50 && didDropNut1 == false && isRunning) {
		didDropNut1 = true;
		animateCoconut(coconut1, 189);
	} else if (currentBpm > 50 && didDropNut1 == true && !isRunning) {
		didDropNut1 = false;
	}
	if (currentBpm > 300 && didDropNut2 == false && isRunning) {
		didDropNut2 = true;
		animateCoconut(coconut2, 189);
	} else if (currentBpm < 300 && didDropNut2 == true && !isRunning) {
		didDropNut2 = false;
	}
}

plusBPMes.addEventListener('click', () => {
	console.log('plus');
	if (beatsPerMeasure <= 11) { 
	beatsPerMeasure++;
	inputMes.textContent = beatsPerMeasure;
	count = 0;
	}
}) 

minusBPMes.addEventListener('click', () => {
	console.log('minus');
	if (beatsPerMeasure >= 2) { 
	beatsPerMeasure--;
	inputMes.textContent = beatsPerMeasure;
	count = 0;
	}
}) 

const btnAdd = () => {
	input.value < 345 ? 
	input.value = parseInt(input.value) + 1 :
	input.value = 345;
	metronome.timeInterval = 60000 / input.value;
}

const btnSubtract = () => {
	input.value > 15 ?
	input.value = parseInt(input.value) - 1 :
	input.value = 15;
	metronome.timeInterval = 60000 / input.value;
}

const moveBtnR = () => {
	if (btnLeft < 330) {
	btnLeft += 2;
	button.style.left = btnLeft + 'px';
	}
}

const moveBtnL = () => {
	if (btnLeft > -330) {
	btnLeft -= 2;
	button.style.left = btnLeft + 'px';
	}
}

const arrowBtn = (e) => {
	if (e.keyCode==39) {
		moveBtnR();
		btnAdd();
		maybeShowCoconutEasterEgg(input.value);
	}
	if (e.keyCode==37) {
		moveBtnL();
		btnSubtract();
		maybeShowCoconutEasterEgg(input.value);
	}
}

const togglePausePlayIcon = () => {
	if (isPaused == true) {
		icon.src = 'pause-icon.png';
	} else {
		icon.src = 'play-icon.png';
	}
	isPaused = !isPaused; 
}

const coconutFadeOut = () => {
	intervalID = setInterval(coconutHide, 80);
}

const animateCoconut = (coconutToAnimate, coconutPosition) => {
	if (intervalID) {
		return;
	}

	coconut = coconutToAnimate;
	initialCoconutPosition = coconutPosition;
	coconutPosition = initialCoconutPosition;
	intervalID = setInterval(coconutFall, 3);
}

const coconutFadeIn = () => {
	coconutPosition = initialCoconutPosition;
	coconut.style.top = coconutPosition + 'px';
	intervalID = setInterval(coconutShow, 80);
}

const coconutHide = () => {
	opacity = Number(window.getComputedStyle(coconut)
	.getPropertyValue("opacity"));
	if (opacity > 0) {
		opacity = opacity - 0.1;
		coconut.style.opacity = opacity;
	} else {
		clearInterval(intervalID);
		coconutFadeIn();
	}
}

const coconutShow = () => {
	opacity = Number(window.getComputedStyle(coconut)
	.getPropertyValue("opacity"));
	if (opacity < 1) {
		opacity = opacity + 0.1;
		coconut.style.opacity = opacity;
	} else {
		clearInterval(intervalID);
		intervalID = null;
	}
}

const coconutFall = () => {
	coconut.style.top = coconutPosition + 'px';
	coconutPosition++;
	if (coconutPosition === 602) {
		clearInterval(intervalID);
		setTimeout(function() {
			coconutFadeOut();
		}, 3000);
	}
}

plusBtn.onclick = () => {
	moveBtnR();
	btnAdd();
	maybeShowCoconutEasterEgg(input.value);
}

minusBtn.onclick = () => {
	moveBtnL();
	btnSubtract();
	maybeShowCoconutEasterEgg(input.value);
}

button.onclick = () => {
	if (didDrag == true) {
		return;
	}

	togglePausePlayIcon();
	count = 0;
	if (!isRunning) {
		metronome.start();
		isRunning = true;
	} else {
		metronome.stop();
		isRunning = false;
	}
	maybeShowCoconutEasterEgg(input.value);
}

document.onkeydown = arrowBtn;

function playClick() {
	if (beatsPerMeasure == 1) {
		count = 2;
	}
	if (beatsPerMeasure === count) {
		count = 0;
	}
	if (count === 0) {
		click2.play();
		click2.currentTime = 0;
	} else {
		click1.play();
		click1.currentTime = 0;
	}
	count++;
}

const metronome = new Timer(playClick, 60000 / input.value, {immediate: true});




