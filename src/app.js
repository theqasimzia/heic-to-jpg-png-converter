const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const heicConvert = require('heic-convert'); // Import heic-convert

const app = express();
const PORT = process.env.PORT || 3000;

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

// Endpoint to handle image uploads and conversion
app.post('/convert', upload.array('images', 200), async (req, res) => {
  try {
    console.log('Received request to convert images');

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      throw new Error('No files uploaded');
    }

    const format = req.body.format || 'jpg';
    const convertedImages = [];
    console.log(`Converting images to ${format}`);

    // Create an output directory if it doesn't exist
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
      console.log('Output directory created');
    }

    for (const file of req.files) {
      const outputFilePath = path.join(outputDir, `${file.originalname}.${format}`);
      console.log(`Processing file: ${file.path}`);

      // Convert HEIC to buffer using heic-convert
      const inputBuffer = fs.readFileSync(file.path);
      const outputBuffer = await heicConvert({
        buffer: inputBuffer, // the HEIC file buffer
        format: 'JPEG', // can be 'JPEG' or 'PNG'
        quality: 1 // the quality of the output file
      });

      // Use sharp to save the buffer to the desired format
      await sharp(outputBuffer)
        .toFormat(format)
        .toFile(outputFilePath)
        .catch(err => {
          console.error('Sharp Error:', err);
          throw new Error('Failed to convert image with sharp');
        });

      console.log(`Image converted successfully: ${outputFilePath}`);
      convertedImages.push(outputFilePath);
    }

    res.json({ message: 'Conversion successful', files: convertedImages });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
