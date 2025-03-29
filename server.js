const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;

// Set up multer storage (you can customize it based on your needs)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  }
});

const upload = multer({ storage: storage });

// Route for uploading a file
app.post("/upload", upload.single('file'), (req, res) => {
  if (req.file) {
    // Respond with the file details and a download URL
    res.status(200).json({
      message: "File uploaded successfully",
      file: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimeType: req.file.mimetype,
        downloadUrl: `http://localhost:${PORT}/uploads/${req.file.filename}` // Add a URL to download the file
      }
    });
  } else {
    res.status(400).json({ message: "No file uploaded" });
  }
});

// Route for downloading the file
app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.sendFile(filePath);
});

// Serve Swagger UI from the 'dist' folder (ensure Swagger UI is built correctly)
app.use(express.static(path.join(__dirname, 'dist')));

// Serve Swagger UI entry point (index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


