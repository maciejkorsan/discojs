const ac = new AudioContext(),
    destination = ac.destination,
    analyser = ac.createAnalyser(),
    bufferLength = analyser.frequencyBinCount,
    frequencyData = new Uint8Array(512);

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        let microphone = ac.createMediaStreamSource(stream),
            micGain = ac.createGain();
        micGain.gain.value = 1;
        microphone.connect(micGain);
        micGain.connect(analyser);
    });

analyser.fftSize = 1024;

const allEls = document.querySelectorAll('i');
const header = document.querySelector('h1 span');

function animate() {
    analyser.getByteFrequencyData(frequencyData);
    for (let i = 0; i < allEls.length; i++) {
        allEls[i].style.backgroundColor = `hsla(${i*10}, 80%, 50%, 0.8)`;
        allEls[i].style.height = `${Math.pow(frequencyData[i]/4,2)/40}%`; 
        header.style.transform = `scale(${frequencyData[6]/255/4+0.75})`;
    }
    requestAnimationFrame(animate);
}

animate();
