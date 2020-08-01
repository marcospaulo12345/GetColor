const { response } = require('express');
const { report } = require('../Routes/imageProcessingRoutes');

const Jimp = require('jimp');

class imageProcessingController {
    async getColor(req, res) {
        const image = await Jimp.read(req.files[0].path);
        const x = image.bitmap.width  / 2;
        const y = image.bitmap.height / 2;
        const hex = image.getPixelColor(x, y);
        const cor = Jimp.intToRGBA(hex);
        return res.send(cor)
    }
}

module.exports = new imageProcessingController;