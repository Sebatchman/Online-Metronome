const button = document.getElementsByClassName('btn')[0];
const minusBPMes = document.getElementsByClassName('minus-bpMes')[0];
const plusBPMes = document.getElementsByClassName('plus-bpMes')[0];
const inputMes = document.getElementsByClassName('bpMes')[0];
const input = document.querySelector('input');
const icon = document.querySelector('img');
const plusBtn = document.getElementById('rightBtn');
const minusBtn = document.getElementById('leftBtn');


let click1 = new Audio('beat-sound.wav');
let click2 = new Audio('bar-sound.wav');

let btnLeft = 0;
let isPaused = true;
let isRunning = false;
let beatsPerMeasure = 4;
let count = 0;

function Timer(callback, timeInterval, options) {
	this.timeInterval = timeInterval;
	this.start = () => {
		this.expected = Date.now() + this.timeInterval;
			this.theTimeout = null;
				if (options.immediate) {
					callback();
				}
			this.timeout = setTimeout(this.round, this.timeInterval);
		console.log('Started');
	}
	this.stop = () => {
		clearTimeout(this.timeout);
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
}

plusBPMes.addEventListener('click', () => {
	console.log('plus');
	if (beatsPerMeasure >= 12) { 
	return beatsPerMeasure++;
	inputMes.textContent = beatsPerMeasure;
	}
}) 

minusBPMes.addEventListener('click', () => {
	console.log('minus');
	if (beatsPerMeasure <= 2) { 
	return  beatsPerMeasure--;
	inputMes.textContent = beatsPerMeasure;
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
	}
	if (e.keyCode==37) {
		moveBtnL();
		btnSubtract();
	}
}

const pausePlay = () => {
	if (isPaused == true) {
		icon.src = 'pause-icon.png';
	} else {
		icon.src = 'play-icon.png';
	}
	isPaused = !isPaused;
}

plusBtn.onclick = () => {
	moveBtnR();
	btnAdd();
}

minusBtn.onclick = () => {
	moveBtnL();
	btnSubtract();
}

button.onclick = () => {
	pausePlay();
	count = 0;
	if (!isRunning) {
		metronome.start();
		isRunning = true;
	} else {
		metronome.stop();
		isRunning = false;
	}
}

document.onkeydown = arrowBtn;

function playClick() {
	if (beatsPerMeasure === count) {
		count = 0;
	}
	if (count === 0) {
		click2.play();
	} else {
		click1.play();
	}
	count++;
}

const metronome = new Timer(playClick, 60000 / input.value, {immediate: true});




