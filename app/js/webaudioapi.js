const ac = new AudioContext(),
    destination = ac.destination,
    analyser = ac.createAnalyser(),
    bufferLength = analyser.frequencyBinCount,
    frequencyData = new Uint8Array(1024);

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        let microphone = ac.createMediaStreamSource(stream),
            micGain = ac.createGain();
        micGain.gain.value = 1;
        microphone.connect(micGain);
        micGain.connect(analyser);
    });

analyser.fftSize = 2048;

const allEls = document.querySelectorAll('i');

function animate() {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(frequencyData);
    for (let i = 0; i < allEls.length; i++) {
        allEls[i].style.backgroundColor = `#fff`;
        allEls[i].style.height = `${Math.pow(frequencyData[i]/4,2)/40}%`; 
    }
}

animate();