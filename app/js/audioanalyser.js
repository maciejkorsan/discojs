const ac = new AudioContext(),
    destination = ac.destination,
    analyser = ac.createAnalyser(),
    bufferLength = analyser.frequencyBinCount,
    frequencyData = new Uint8Array(512);

  let audio = document.createElement('audio');
    audio.src = `/assets/daftpunk/17.wav`;

    let background = ac.createMediaElementSource(audio);

    background.connect(analyser);
    background.connect(destination);
    audio.play();




analyser.fftSize = 1024;

const allEls = document.querySelectorAll('i');

function animate() {
    analyser.getByteFrequencyData(frequencyData);
    for (let i = 0; i < allEls.length; i++) {
        allEls[i].style.backgroundColor = `hsla(${i*2}, 80%, 50%, 0.8)`;
        allEls[i].style.height = `${Math.pow(frequencyData[i]/4,2)/40}%`; 
    }
    requestAnimationFrame(animate);
}

animate();
