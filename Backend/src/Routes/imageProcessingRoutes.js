const express = require('express');
const multer = require('multer');

const router = express.Router();

const imageProcesingController = require('../Controller/imageProcessingController');

const Storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './src/assets');
    },
    filename(req, file, callback) {
        callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({storage: Storage});

router.post('/getColor', upload.array('file', 3), imageProcesingController.getColor);

module.exports = router;