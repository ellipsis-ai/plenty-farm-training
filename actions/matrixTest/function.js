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
  t.plan(6);
  
  const matrix = new Matrix(testData);
  const pretendToday = moment.tz("2019-02-04", "YYYY-MM-DD", "UTC").startOf('day');
  const oldTrainings = matrix.getOldTrainings(180, pretendToday, "UTC");
  t.equal(oldTrainings.length, 75, "75 expired training sessions");

  const matrixWarnings = matrix.validateTrainingDates();
  t.equal(matrixWarnings.length, 1, "1 matrix date warning");
  t.assert(matrixWarnings[0].includes(" H54"), "Warning is for cell H54");

  const trainingWarnings = Training.validateList(oldTrainings);
  t.equal(trainingWarnings.length, 2, "2 training data validation warnings");
  t.assert(trainingWarnings[0].includes(" AM9"), "Warning #1 is for cell AM9");
  t.assert(trainingWarnings[1].includes(" U56"), "Warning #2 is for cell U56");
});
}
