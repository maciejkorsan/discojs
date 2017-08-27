	const ac = new AudioContext(),
    destination = ac.destination,
    oscillator = ac.createOscillator(),
    gainNode = ac.createGain(),
    analyser = ac.createAnalyser(),
    bufferLength = analyser.frequencyBinCount;
  let frequencyData = new Uint8Array(bufferLength);

  analyser.fftSize = 256;
  gainNode.gain.value = 0.5;
	gainNode.connect(analyser);
	gainNode.connect(destination);
 	

	oscillator.type = 'triangle'; 
  oscillator.frequency.value = 220;
	oscillator.start(); 
  oscillator.connect(gainNode);


	const rangeElement = document.querySelector('.oscillator__range');

	rangeElement.addEventListener('change', () => {
		oscillator.frequency.value = rangeElement.value;
	 	analyser.getByteFrequencyData(frequencyData);
	 	console.log(frequencyData);
	});
