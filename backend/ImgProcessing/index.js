const express = require('express');
const multer = require("multer");
const utils = require('./utils/utils');
const cors = require('cors');
const app = express();
const upload = multer();


const corsOptions = {
    origin: ["http://localhost:4000", "https://calocheck.yungying.com"],
    credentials : true
  }
  app.use(cors(corsOptions));

app.post('/detect', upload.single('image_file'), async function (req, res) {
    if(!req.file) {
        return res.status(400).send('No file uploaded');
    }
    const boxes = await utils.detect_objects_on_image(req.file.buffer, 0.5); //2nd parameter is threshold
    res.json(boxes);
});

app.listen(4002, () => {
    console.log('Server is listening on port 4002')
});
