function(trainingData, ellipsis) {
  const Training = require('Training');
const Matrix = require('Matrix');
const training = Training.fromString(trainingData);

Matrix.saveData(ellipsis, training.date, training.cellLabel).then(() => {
  ellipsis.success(`OK. The training session has been confirmed and saved (spreadsheet cell ${training.cellLabel}).`);
});
}
