function(ellipsis) {
  const testDataCsv = require('testData');
const test = require('tape');
const Matrix = require('Matrix');
const d3 = require("d3-dsv");
const moment = require('moment-timezone');
const testData = d3.csvParseRows(testDataCsv);

test.onFailure(ellipsis.error);
test.onFinish(() => ellipsis.success("All passed!"));
test('Matrix', (t) => {
  t.plan(3);
  
  const matrix = new Matrix(testData);
  const pretendToday = moment.tz("2019-02-04", "YYYY-MM-DD", "UTC").startOf('day');
  const oldTrainings = matrix.getOldTrainings(180, pretendToday, "UTC");
  t.equal(oldTrainings.length, 34, "34 expired training sessions");

  const warnings = matrix.validateTrainingDates();
  t.equal(warnings.length, 1, "1 training date warning");
  t.assert(warnings[0].includes(" Y122"), "Warning is for cell Y122");
});
}
