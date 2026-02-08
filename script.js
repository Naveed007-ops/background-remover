// Import the BodyPix library
import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs';

async function loadModel() {
    return await bodyPix.load();
}

async function detectBodyParts(videoElement) {
    const net = await loadModel();
    const segmentation = await net.segmentPerson(videoElement);

    return segmentation;
}

async function drawSegmentedForeground(videoElement, canvasElement) {
    const ctx = canvasElement.getContext('2d');
    const segmentation = await detectBodyParts(videoElement);

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.drawImage(videoElement, 0, 0);

    bodyPix.drawMask(
        canvasElement,
        videoElement,
        segmentation,
        1, // opacity
        0, // maskBlur
        false // flipHorizontal
    );
}

// Assuming there is a video element in the DOM
const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');

videoElement.addEventListener('loadeddata', () => {
    setInterval(() => {
        drawSegmentedForeground(videoElement, canvasElement);
    }, 100);
});

// Start video stream
navigator.mediaDevices.getUserMedia({
    video: true
}).then(stream => {
    videoElement.srcObject = stream;
});