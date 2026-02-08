# 🎨 Background Remover

An AI-powered web application that removes backgrounds from images instantly using TensorFlow.js and machine learning segmentation.

## Features

✅ **Drag & Drop Upload** - Easy image upload with drag and drop support  
✅ **AI-Powered Segmentation** - Uses TensorFlow.js for accurate background removal  
✅ **Real-time Preview** - See before and after images side by side  
✅ **Download Result** - Save processed images as PNG with transparent background  
✅ **Responsive Design** - Works seamlessly on mobile and desktop devices  
✅ **Modern UI** - Beautiful gradient design with smooth animations  
✅ **No Server Required** - Runs completely in the browser  

## How It Works

1. Upload an image by dragging & dropping or clicking the upload box
2. The AI model analyzes the image and detects the foreground subject
3. The background is automatically removed and made transparent
4. Download your processed image in PNG format

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **AI/ML**: TensorFlow.js, Body Segmentation Model
- **Image Processing**: Canvas API

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for loading TensorFlow.js models)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Naveed007-ops/background-remover.git
cd background-remover
```

2. Open in your browser:
```bash
# Simply open index.html in your browser
open index.html
```

Or use a local server:
```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

## File Structure

```
background-remover/
├── index.html      # Main HTML file
├── styles.css      # Styling and animations
├── script.js       # JavaScript logic and AI processing
└── README.md       # Documentation
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Works best with images under 5MB
- Requires at least 4GB RAM for optimal performance
- Model loads once and is cached in browser memory

## Limitations

- Background removal accuracy depends on image quality and contrast
- Very small or low-resolution images may have reduced accuracy
- Works best with clear foreground/background separation

## Future Enhancements

- [ ] Support for batch processing
- [ ] Custom color replacement options
- [ ] Background blur effect
- [ ] Advanced editing tools
- [ ] Image comparison slider
- [ ] PWA support for offline usage

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Naveed007-ops** - Created with ❤️

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.

---

Made with ❤️ using TensorFlow.js