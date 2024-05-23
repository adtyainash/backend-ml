const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = score[0] * 100;

        let label, suggestion;

        if (confidenceScore > 50) {
            label = 'Cancer';
            suggestion = "Segera konsultasi dengan dokter untuk pemeriksaan lebih lanjut dan penanganan yang tepat.";
        } else {
            label = 'Non-cancer';
            suggestion = "Lakukan pemeriksaan kesehatan secara berkala untuk memastikan kondisi kesehatan yang optimal.";
        }

        return { confidenceScore, label, suggestion };
}

module.exports = predictClassification;
