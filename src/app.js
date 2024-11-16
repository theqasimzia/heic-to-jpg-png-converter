const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple route for testing
app.get('/', (req, res) => {
  res.send('HEIC to JPG/PNG Converter API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
