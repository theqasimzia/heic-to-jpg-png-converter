const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Endpoint to handle image uploads and conversion
app.post('/convert', upload.array('images', 200), async (req, res) => {
  try {
    const convertedImages = [];

    // Create an output directory if it doesn't exist
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Loop through uploaded images and convert them
    for (const file of req.files) {
      const outputFilePath = path.join(outputDir, `${file.originalname}.jpg`);
      
      await sharp(file.path)
        .toFormat('jpg')
        .toFile(outputFilePath);

      convertedImages.push(outputFilePath);
    }

    res.json({ message: 'Conversion successful', files: convertedImages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong during conversion' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.static('public'));
