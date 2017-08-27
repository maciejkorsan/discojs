const NOTES = {
	'A5': 440,
	'A#5': 466.16,
	'B5': 493.88,
	'C5': 523.25,
	'C#5': 554.37,
	'D5': 587.33,
	'D#5': 622.25,
	'E5': 659.25,
	'F5': 698.46,
	'F#5': 739.99,
	'G5': 783.99,
	'G#5': 830.61,
	'A6': 880.00,
	'A#6': 932.33,
	'B6': 987.77,
	'C6': 1046.50,
	'C#6': 1108.73,
	'D6': 1174.66,
	'D#6': 1244.51,
	'E6': 1318.51
},

tempo = 120,
beatDuration = tempo / 60;

const melody = [
	{
		note: 'C5',
		startTime: 0,
		duration: 1,
		played: false,
	},
	{
		note: 'D5',
		startTime: 1,
		duration: 1,
		played: false,
	},
	{
		note: 'E5',
		startTime: 2,
		duration: 1,
		played: false,
	},
	{
		note: 'F5',
		startTime: 3,
		duration: 1,
		played: false,
	},
	{
		note: 'G5',
		startTime: 4,
		duration: 1,
		played: false,
	},
	{
		note: 'A6',
		startTime: 5,
		duration: 1,
		played: false,
	},
	{
		note: 'B6',
		startTime: 6,
		duration: 1,
		played: false,
	},
	{
		note: 'C6',
		startTime: 7,
		duration: 1,
		played: false,
	}
];

const ac = new AudioContext(),
	destination = ac.destination;

let reqFrame,
	startTime;

let notesToPlay = [];

let gain = ac.createGain();

const noteValue = document.querySelector('.melody__note');

gain.gain.value = 0.05;
gain.connect(destination);

startTime = ac.currentTime;

const playLoop = () => {
	let currentTime = (ac.currentTime - startTime) * beatDuration;
	for (let i = 0, len = melody.length; i < len; i++) {
		let note = melody[i]; 
		if (!note.played && currentTime > note.startTime) {
			note.played = true;
			let osc = ac.createOscillator();
			osc.frequency.value = NOTES[note.note];
			noteValue.innerHTML = note.note;
			osc.type = 'square'; 
			osc.connect(gain); 
			osc.start();
			osc.stop(ac.currentTime + note.duration /	 beatDuration);
		}
	}
	reqFrame = requestAnimationFrame(playLoop);
}

playLoop();




