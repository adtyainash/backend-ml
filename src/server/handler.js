const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  if (image.hapi.headers['content-length'] > 1000000) {
    throw new InputError('Payload content length greater than maximum allowed: 1000000');
    }

    try {
        const { confidenceScore, label, suggestion } = await predictClassification(model, image); // Ensure these variables are correct
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id: id,
            result: label, // Changed to match your structure
            suggestion: suggestion,
            createdAt: createdAt
        };

        const response = h.response({
            status: 'success',
            message: confidenceScore > 99 ? 'Model is predicted successfully' : 'Model is predicted successfully but under threshold. Please use the correct picture',
            data: data
        });
        response.code(201);
        return response;
    } catch (error) {
        console.error(error);
        throw new InputError('Terjadi kesalahan dalam melakukan prediksi', 400);
    }
}

module.exports = postPredictHandler;
