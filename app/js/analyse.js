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

let Webcam = require('webcamjs');

Webcam.set({
    width: 640,
    height: 480,
    image_format: 'jpeg',
    jpeg_quality: 90
});
Webcam.attach('#my_camera');

const camera = document.querySelector('.camera');

const ac = new AudioContext(),
    destination = ac.destination,
    analyser = ac.createAnalyser(),
    frequencyData = new Uint8Array(128);

analyser.fftSize = 256;

const allEls = document.querySelectorAll('i');
const programistokSrc = document.querySelector('#programistok');

const beatSrc = document.querySelector('#beat2');
let beat = ac.createMediaElementSource(beatSrc),
    beatGain = ac.createGain();
beatGain.gain.value = 1;
beat.connect(beatGain);
beatGain.connect(ac.destination);
beatGain.connect(analyser);

let programistok = ac.createMediaElementSource(programistokSrc),
    programistokGain = ac.createGain();
programistokGain.gain.value = 1;
programistok.connect(programistokGain);
programistokGain.connect(ac.destination);
programistokGain.connect(analyser);

const playLoop = () => {
    let currentTime = (ac.currentTime - startTime) * beatDuration;
    for (let i = 0, len = notesToPlay.length; i < len; i++) {
        let note = notesToPlay[i];
        if (!note.played && currentTime > note.startTime) {
            note.played = true;
            let osc = ac.createOscillator();
            osc.frequency.value = NOTES[note.note];
            osc.type = 'square';
            osc.connect(compressor);
            osc.start();
            osc.stop(ac.currentTime + note.duration / beatDuration);
        }
    }
    reqFrame = requestAnimationFrame(playLoop);
}

function animate() {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(frequencyData);
    for (let i = 0; i < allEls.length; i++) {
        allEls[i].style.backgroundColor = `hsla(${i*10}, 80%, 50%, 0.8)`;
        allEls[i].style.height = Math.pow(frequencyData[i] / 4, 2) / 10 + 'px';
    }
}

animate();


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
    console.log(data);
    if (data[1] == 21) {
        programistokGain.gain.value = data[2] / 127
    }
    if (data[1] == 40) {
        if (data[0] == 153) {
            programistokSrc.currentTime = 0;
            programistokSrc.play();
        } else {
            // programistokSrc.pause();
        }
    }

    if (data[1] == 36) {
        programistokSrc.pause();
    }

    if (data[1] == 22) {
        beatGain.gain.value = data[2] / 127;
    }
    if (data[1] == 41) {
        if (data[0] == 153) {
            beatSrc.currentTime = 0;
            beatSrc.play();
        } else {}
    }

    if (data[1] == 28) {
    	camera.style.opacity = data[2] / 127
    }



}