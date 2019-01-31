function(daysOld, ellipsis) {
  const client = require('google-client')(ellipsis);
const {google} = ellipsis.require('googleapis@36.0.0');
const sheets = google.sheets('v4');
const Matrix = require('Matrix');

client.authorize().then(() => {
  return sheets.spreadsheets.values.get({
    spreadsheetId: ellipsis.env.SSF_FARM_TRAINING_SHEET_ID,
    range: ellipsis.env.SSF_FARM_TRAINING_SHEET_NAME,
    auth: client
  }).catch((err) => {
    throw new ellipsis.Error(err, {
      userMessage: "An error occurred while trying to read the SSF Farm Training matrix"
    });
  });
}).then((result) => {
  const rows = result.data.values;
  if (!rows || !rows.length) {
    throw new ellipsis.Error("Couldn't retrieve spreadsheet rows to update: unexpected sheet object.", {
      userMessage: "No data was found in the SSF Farm training spreadsheet"
    });
  }
  const matrix = new Matrix(rows);
  const trainings = matrix.getOldTrainings(daysOld);
  ellipsis.success(require('util').inspect(trainings));
});
}
