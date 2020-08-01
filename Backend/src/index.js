const express = require('express');

const server = express();
server.use(express.json())

const ImageProcessingRoutes = require('./Routes/imageProcessingRoutes');
server.use('/imageProcessing',ImageProcessingRoutes);

server.listen(3000, () => {
    console.log('API Online')
});