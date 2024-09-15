const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Define the path to the 'public/' directory
const publicDir = path.join(process.cwd(), 'public');

// Check if 'public/' directory exists, if not, create it
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Configure storage for the uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, publicDir); // Use the defined 'public/' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
module.exports = upload;