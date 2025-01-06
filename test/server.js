const express = require('express');
const cors = require('cors'); // Import CORS middleware
const multer = require('multer'); // For handling file uploads
const fs = require('fs'); // For file system operations

const app = express();
const PORT = 3000;

app.use(cors()); // Enable CORS for all routes
const { GoogleGenerativeAI } = require("@google/generative-ai");
const upload = multer({ dest: 'uploads/' }); // Files will be saved in the "uploads" directory

// Initialize Google Generative AI client

// const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const genAI = new GoogleGenerativeAI("AIzaSyA03dv2zuKulp2zXhI-KxI8B_Yd45vGiC4");
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Endpoint to handle image and prompt
app.post('/process', upload.single('image'), async (req, res) => {
  try {
    const { prompt } = req.body; // Extract prompt from request body
    const imageFile = req.file; // Uploaded image file

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required.' });
    }

    if (!imageFile) {
      return res.status(400).json({ success: false, message: 'Image file is required.' });
    }

    
    const image = {
      inlineData: {
        data: Buffer.from(fs.readFileSync(imageFile.path)).toString("base64"),
        mimeType: "image/jpeg",
      },
    };
    
    // Example of sending the prompt to the Gemini API
    
    const response = await model.generateContent([prompt, image]);
    res.status(200).json({ success: true, result: response });
    console.log(JSON.stringify(response, null, 2));

    // res.status(200).json({
    //   success: true,
    //   result: response,
    // });
  } catch (error) {
    console.error('Error processing the request:', error);
    console.error(error);
    res.status(500).json({ success: false, message: 'Error processing the request.', error: error.message });
  }
});

// Middleware to parse JSON
app.use(express.json());

// Define a test route
// app.get('/', (req, res) => {
//   res.send('Hello, World! Your Express server is running.');
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});