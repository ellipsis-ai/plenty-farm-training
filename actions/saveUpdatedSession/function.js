function(trainingData, sheet, ellipsis) {
  const Training = require('Training');
const Matrix = require('Matrix');
const training = Training.fromString(trainingData);

Matrix.saveData(ellipsis, sheet.name, training.date, training.cellLabel).then(() => {
  ellipsis.success(`OK. The training session has been confirmed and saved (spreadsheet tab ${sheet.name}, cell ${training.cellLabel}).`);
});
}
