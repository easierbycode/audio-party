const container = document.getElementById('container');
const canvas = <HTMLCanvasElement>document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let audioSource;
let analyser;

container.addEventListener('click', () => {
    const audio1 = <HTMLMediaElement>document.getElementById('audio1');
    const audioContext = new AudioContext();
    audio1.play();

    // if audio1.src = 'BASE64...'
    // audioSource = <MediaElementAudioSourceNode>audioContext.createMediaElementSource(audio1);
    // if <audio> has src='', use approach below
    audioSource = <MediaElementAudioSourceNode>new MediaElementAudioSourceNode(audioContext, {
        mediaElement: audio1
    });
    
    analyser = <AnalyserNode>audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = canvas.width / bufferLength;
    let barHeight;
    let x;

    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            ctx.fillStyle = 'white';
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth;
        }
        requestAnimationFrame(animate);
    }

    animate();
});