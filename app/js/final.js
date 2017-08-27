let Webcam = require('webcamjs');

Webcam.set({
    width: 320,
    height: 240,
    image_format: 'jpeg',
    jpeg_quality: 90
});
Webcam.attach('#my_camera');

const camera = document.querySelector('.camera');
const video = document.querySelector('.video__background');

const ac = new AudioContext(),
    destination = ac.destination,
    analyser = ac.createAnalyser(),
		compressor = ac.createDynamicsCompressor(),
    bufferLength = analyser.frequencyBinCount,
    frequencyData = new Uint8Array(bufferLength),
    gain = ac.createGain();

analyser.fftSize = 2048;
analyser.smoothingTimeConstant = 0.5;


gain.gain.value = 1;
gain.connect(destination);
gain.connect(analyser);

const allEls = document.querySelectorAll('i');
const programistokSrc = document.querySelector('#programistok');


let samples = [],
    samplesElements = [];


let programistok = ac.createMediaElementSource(programistokSrc),
    programistokGain = ac.createGain();
programistokGain.gain.value = 1;
programistok.connect(programistokGain);
programistokGain.connect(ac.destination);
programistokGain.connect(analyser);


for (let i=0; i<4; i++) {
    let audio = document.createElement('audio');
    audio.src = `/assets/beat/${i+1}.wav`;
    audio.classList.add(`beat-${i+1}`);
    //document.body.appendChild(audio);
    samplesElements.push(audio);
    samples[i] = ac.createMediaElementSource(audio);
    samples[i].connect(gain);
}





function animate() {
    requestAnimationFrame(animate);
 		analyser.getByteFrequencyData(frequencyData);
    for (let i = 0; i < allEls.length; i++) {
        allEls[i].style.backgroundColor = `hsla(${i*2}, 80%, 50%, 0.8)`;
        allEls[i].style.height = `${Math.pow(frequencyData[i]/4,2)/40}%`; 
    }
    video.style.transform = `scale(${1 + frequencyData[8]/555})`;
    video.style.opacity = `${frequencyData[8]/255}`;
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
        } 
    }

    if (data[1] == 36) {
        programistokSrc.pause();
    }

    if (data[1] == 22) {
        beatGain.gain.value = data[2] / 127;
    }

    if (data[1] == 28) {
    	camera.style.opacity = data[2] / 127
    }

    if (data[1] == 27) {
    	video.style.opacity = data[2] / 127
    }



     if (data[0] == 153 || data[0] == 176)
        switch (data[1]) {
            case 48:  
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
          }

}