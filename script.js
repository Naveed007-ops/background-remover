// Initialize the upload box
const uploadBox = document.getElementById('uploadBox');
const imageInput = document.getElementById('imageInput');
const previewSection = document.getElementById('previewSection');
const originalImage = document.getElementById('originalImage');
const outputCanvas = document.getElementById('outputCanvas');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const processingInfo = document.getElementById('processingInfo');

let segmentationModel = null;
let currentImageFile = null;

// Initialize TensorFlow model
async function initializeModel() {
    try {
        console.log('Loading segmentation model...');
        segmentationModel = await bodySegmentation.SelfieSegmentation({
            runtime: 'tfjs',
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation'
        });
        console.log('Model loaded successfully!');
    } catch (error) {
        console.error('Failed to load model:', error);
        alert('Failed to load the AI model. Please refresh the page.');
    }
}

// Click to upload
uploadBox.addEventListener('click', () => {
    imageInput.click();
});

// Drag and drop
uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('active');
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('active');
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('active');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleImageUpload(files[0]);
    }
});

// File input change
imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleImageUpload(e.target.files[0]);
    }
});

// Handle image upload
function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    currentImageFile = file;
    const reader = new FileReader();
    
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        originalImage.onload = () => {
            previewSection.style.display = 'block';
            removeBackground();
        };
    };
    
    reader.readAsDataURL(file);
}

// Remove background using AI segmentation
async function removeBackground() {
    if (!segmentationModel || !originalImage.complete) {
        console.error('Model not ready or image not loaded');
        return;
    }

    processingInfo.style.display = 'block';

    try {
        // Set canvas dimensions to match image
        outputCanvas.width = originalImage.naturalWidth;
        outputCanvas.height = originalImage.naturalHeight;

        const ctx = outputCanvas.getContext('2d');

        // Create a temporary canvas for segmentation
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = originalImage.naturalWidth;
        tempCanvas.height = originalImage.naturalHeight;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(originalImage, 0, 0);

        // Run segmentation
        console.log('Running segmentation...');
        const segmentation = await segmentationModel.segmentPeople(tempCanvas);

        if (!segmentation || segmentation.length === 0) {
            console.log('No segmentation found, using edge detection');
            applySimpleBackgroundRemoval(ctx);
        } else {
            // Draw image with transparent background
            ctx.drawImage(originalImage, 0, 0);
            const imageData = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
            const data = imageData.data;

            const mask = segmentation[0].mask;
            const maskData = mask.getUnmaskedArea();

            for (let i = 0; i < data.length; i += 4) {
                const pixelIndex = i / 4;
                if (!maskData[pixelIndex]) {
                    // Make background transparent
                    data[i + 3] = 0; // alpha channel
                }
            }

            ctx.putImageData(imageData, 0, 0);
            console.log('Background removed successfully');
        }

        processingInfo.style.display = 'none';
    } catch (error) {
        console.error('Error during segmentation:', error);
        processingInfo.style.display = 'none';
        alert('Error processing image. Please try another image.');
    }
}

// Simple background removal using color detection
function applySimpleBackgroundRemoval(ctx) {
    const imageData = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = imageData.data;

    // Get average background color (corners)
    const bgColor = getBackgroundColor();

    const tolerance = 50;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Check if pixel is similar to background color
        if (isSimilarColor([r, g, b], bgColor, tolerance)) {
            data[i + 3] = 0; // Make transparent
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Get background color from image corners
function getBackgroundColor() {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = originalImage.naturalWidth;
    ctx.canvas.height = originalImage.naturalHeight;
    ctx.drawImage(originalImage, 0, 0);

    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;

    let r = 0, g = 0, b = 0;
    const cornerSize = 20;
    let count = 0;

    // Sample corners
    for (let i = 0; i < cornerSize * cornerSize * 4; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
    }

    return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
}

// Check if two colors are similar
function isSimilarColor(color1, color2, tolerance) {
    return Math.abs(color1[0] - color2[0]) < tolerance &&
           Math.abs(color1[1] - color2[1]) < tolerance &&
           Math.abs(color1[2] - color2[2]) < tolerance;
}

// Download image
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = outputCanvas.toDataURL('image/png');
    link.download = 'background-removed.png';
    link.click();
});

// Reset
resetBtn.addEventListener('click', () => {
    previewSection.style.display = 'none';
    imageInput.value = '';
    currentImageFile = null;
});

// Initialize on page load
window.addEventListener('load', initializeModel);