const ac = new AudioContext(),
    destination = ac.destination,
    analyser = ac.createAnalyser(),
    micGain = ac.createGain(),
    bufferLength = analyser.frequencyBinCount,
    frequencyData = new Uint8Array(16);
let microphone;

micGain.gain.value = 0;
analyser.fftSize = 32;

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        microphone = ac.createMediaStreamSource(stream),
        microphone.connect(micGain);
        micGain.connect(analyser);
    });


const smile = document.querySelector('.smile path');
const header = document.querySelector('h1');

let average = 0;


function calcAverage(data) {
    let sum = 0,
        result = 0;
    for (let i = 0; i < 10; i++) {
        sum += data[i];
    }
    result = sum / 10;
    return result;
}


function animate() {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(frequencyData);
    average = calcAverage(frequencyData);
    smile.setAttribute('d', 'M100,300 C250,' + (average* 1.5 + 130) + ' 400,300 400,300');
    header.style.opacity = average/255;
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
        micGain.gain.value = data[2] / 127
    }
}