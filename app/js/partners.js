const ac = new AudioContext(),
    destination = ac.destination,
    analyser = ac.createAnalyser(),
    bufferLength = analyser.frequencyBinCount,
    frequencyData = new Uint8Array(1024);

  let audio = document.createElement('audio');
    audio.src = `/assets/disco.mp3`;
    audio.loop = true;

    let background = ac.createMediaElementSource(audio);

    background.connect(analyser);
    background.connect(destination);
    audio.play();




analyser.fftSize = 2048;

const allEls = document.querySelectorAll('i');

const headers = document.querySelectorAll('.header');
const logos = document.querySelectorAll('img');

function animate() {
    analyser.getByteFrequencyData(frequencyData);
    for (let i = 0; i < allEls.length; i++) {
        allEls[i].style.backgroundColor = `hsla(${i*2}, 80%, 50%, 0.7)`;
        allEls[i].style.opacity = `${frequencyData[i]/255}`; 
    }
    for (let i = 0; i < logos.length; i++) {
        logos[i].style.transform = `scale(${0.8 + frequencyData[0]/1200})`;
    }
    headers[0].style.transform = `scale(${1 + frequencyData[8]/555})`;
    headers[1].style.transform = `scale(${1 + frequencyData[56]/755})`;
    requestAnimationFrame(animate);
}

animate();
