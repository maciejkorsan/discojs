/* 		var audioContext = new AudioContext();
    // The oscillator creates the sound waves.
    // As you can see on the canvas when drawing
    // the square wave, the wave is not perfectly
    // square. What you see is the Gibbs phenomenon
    // caused by the oscillator using Fourier series
    // to approximate the different wave types.
    var oscillator = audioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = 440;
    oscillator.start();
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);	
    gainNode.gain.value = 0.5;
    window.setTimeout(function(){
    	oscillator.frequency.value = 240;
    },1000);
*/


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
		note: 'A5',
		startTime: 1,
		duration: 2,
	}
];

const ac = new AudioContext(),
	destination = ac.destination;

let playing = false,
	reqFrame,
	startTime;

let notesToPlay = [];

let gain = ac.createGain(),
		reverb = ac.createConvolver(),
		compressor = ac.createDynamicsCompressor();

compressor.treshold.value = -50;
gain.gain.value = 1;
//compressor.connect(gain);

const playLoop = () => {
	let currentTime = (ac.currentTime - startTime) * beatDuration;
	
	for (let i = 0, len = notesToPlay.length; i < len; i++) {
		let note = notesToPlay[i];
		
		if (!note.played && currentTime > note.startTime) {
			note.played = true;
			let osc = ac.createOscillator();
			osc.type = 'square';
			osc.frequency.value = NOTES[note.note];
			osc.connect(compressor);
			osc.start();
			osc.stop(ac.currentTime + note.duration /	 beatDuration);
		}
	}

	reqFrame = requestAnimationFrame(playLoop);
}

const playPause = () => {
	if (!playing) {
		playing = true;
		startTime = ac.currentTime;
		notesToPlay = notes.map((item) => {
			item.played = false;
			return item;
		});
		playLoop();
	} else {
		playing = false;
		cancelAnimationFrame(reqFrame);
	}
	return {
		playPause
	}
}



var midi, data;
// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No MIDI support in your browser.");
}

// midi functions
function onMIDISuccess(midiAccess) {
    // when we get a succesful response, run this code
    midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status

    var inputs = midi.inputs.values();
    // loop over all available inputs and listen for any MIDI input
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    }
}

function onMIDIFailure(error) {
    // when we get a failed response, run this code
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
}

function onMIDIMessage(message) {
    data = message.data; // this gives us our [command/channel, note, velocity] data.
    console.log('MIDI data', data); // MIDI data [144, 63, 73]
    if (data[1]==21) {
    	gain.gain.value = data[2]/127
    }
    if (data[1]==22)
	    oscillator.frequency.value = data[2]*10;
}


