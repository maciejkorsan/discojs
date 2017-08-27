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
		compressor = ac.createDynamicsCompressor(),
    bufferLength = analyser.frequencyBinCount,
    frequencyData = new Uint8Array(bufferLength),
    gain = ac.createGain();
let samples = [],
    samplesElements = [];

gain.gain.value = 1;

analyser.fftSize = 64;
analyser.smoothingTimeConstant = 0.5;

gain.connect(analyser);
gain.connect(destination);

for (let i=0; i<17; i++) {
    let audio = document.createElement('audio');
    audio.src = `/assets/daftpunk/${i+1}.wav`;
    audio.classList.add(`sample-${i+1}`);
    //document.body.appendChild(audio);
    samplesElements.push(audio);
    samples[i] = ac.createMediaElementSource(audio);
    samples[i].connect(gain);
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
    data = message.data; 
    console.log(data);
    if (data[1] == 21) {
        gain.gain.value = data[2] / 127
    }
    if (data[0] == 153 || data[0] == 176)
        switch (data[1]) {
            case 40:  
                samplesElements[0].currentTime = 0;
                samplesElements[0].play();
            break;
            case 41:  
                samplesElements[1].currentTime = 0;
                samplesElements[1].play();
            break;
            case 42:  
                samplesElements[2].currentTime = 0;
                samplesElements[2].play();
            break;
            case 43:  
                samplesElements[3].currentTime = 0;
                samplesElements[3].play();
            break;
            case 48:  
                samplesElements[4].currentTime = 0;
                samplesElements[4].play();
            break;
            case 49:  
                samplesElements[5].currentTime = 0;
                samplesElements[5].play();
            break;
            case 50:  
                samplesElements[6].currentTime = 0;
                samplesElements[6].play();
            break;
            case 51:  
                samplesElements[7].currentTime = 0;
                samplesElements[7].play();
            break;
            case 36:  
                samplesElements[8].currentTime = 0;
                samplesElements[8].play();
            break;
            case 37:  
                samplesElements[9].currentTime = 0;
                samplesElements[9].play();
            break;
            case 38:  
                samplesElements[10].currentTime = 0;
                samplesElements[10].play();
            break;
            case 39:  
                samplesElements[11].currentTime = 0;
                samplesElements[11].play();
            break;
            case 44:  
                samplesElements[12].currentTime = 0;
                samplesElements[12].play();
            break;
            case 45:  
                samplesElements[13].currentTime = 0;
                samplesElements[13].play();
            break;
            case 46:  
                samplesElements[14].currentTime = 0;
                samplesElements[14].play();
            break;
            case 47:  
                samplesElements[15].currentTime = 0;
                samplesElements[15].play();
            break;
            case 108:  
                samplesElements[16].currentTime = 0;
                samplesElements[16].play();
            break;
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

    if (data[1] == 27) {
    	video.style.opacity = data[2] / 127
    }
}