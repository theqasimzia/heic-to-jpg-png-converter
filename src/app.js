const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const heicConvert = require('heic-convert');
const archiver = require('archiver');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/convert', upload.array('images', 200), async (req, res) => {
  try {
    console.log('Received request to convert images');
    if (!req.files || req.files.length === 0) {
      throw new Error('No files uploaded');
    }

    const format = req.body.format || 'jpg';
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const convertedImages = [];
    for (const file of req.files) {
      const outputFilePath = path.join(outputDir, `${file.originalname}.${format}`);
      const inputBuffer = fs.readFileSync(file.path);
      const outputBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 1
      });

      await sharp(outputBuffer)
        .toFormat(format)
        .toFile(outputFilePath);

      convertedImages.push(outputFilePath);
    }

    // Create a zip file
    const zipFilePath = path.join(outputDir, 'converted_images.zip');
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip');

    output.on('close', () => {
      console.log(`Zip file created: ${zipFilePath}`);
      res.json({ message: 'Conversion and zipping successful', zipFilePath });
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);
    convertedImages.forEach((file) => {
      archive.file(file, { name: path.basename(file) });
    });
    archive.finalize();
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
