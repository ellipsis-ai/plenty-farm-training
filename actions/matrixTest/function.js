function(ellipsis) {
  const testDataCsv = require('testData');
const test = require('tape');
const Matrix = require('Matrix');
const Training = require('Training');
const d3 = require("d3-dsv");
const moment = require('moment-timezone');
const testData = d3.csvParseRows(testDataCsv);

test.onFailure(ellipsis.error);
test.onFinish(() => ellipsis.success("All passed!"));
test('Matrix', (t) => {
  t.plan(7);
  
  const matrix = new Matrix(testData);
  const pretendToday = moment.tz("2019-02-04", "YYYY-MM-DD", "UTC").startOf('day');
  const oldTrainings = matrix.getOldTrainings(180, pretendToday, "UTC");
  t.equal(oldTrainings.length, 34, "34 expired training sessions");

  const matrixWarnings = matrix.validateTrainingDates();
  t.equal(matrixWarnings.length, 1, "1 matrix date warning");
  t.assert(matrixWarnings[0].includes(" Y122"), "Warning is for cell Y122");

  const trainingWarnings = Training.validateList(oldTrainings);
  t.equal(trainingWarnings.length, 3, "3 training data validation warnings");
  t.assert(trainingWarnings[0].includes(" AV96"), "Warning #1 is for cell AV96");
  t.assert(trainingWarnings[1].includes(" AV140"), "Warning #2 is for cell AV140");
  t.assert(trainingWarnings[2].includes(" AV141"), "Warning #3 is for cell AV141");
});
}
