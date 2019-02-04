function(sendNotifications, ellipsis) {
  const client = require('google-client')(ellipsis);
const {google} = ellipsis.require('googleapis@36.0.0');
const sheets = google.sheets('v4');
const Matrix = require('Matrix');
const Training = require('Training');
const moment = require('moment-timezone');
const THRESHOLD_IN_DAYS = 180;

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
  const today = moment.tz(ellipsis.team.timeZone).startOf('day');
  const trainings = matrix.getOldTrainings(THRESHOLD_IN_DAYS, today, ellipsis.team.timeZone);
  const matrixWarnings = matrix.validateTrainingDates();
  const peopleCount = new Set(trainings.map((ea) => ea.email)).size;
  const formattedList = Training.formatList(trainings);
  const trainingDataWarnings = Training.validateList(trainings);
  const warnings = matrixWarnings.concat(trainingDataWarnings);
  const thresholdDate = moment.tz(ellipsis.team.timeZone).subtract(THRESHOLD_IN_DAYS, 'days').format('M/D/YYYY');
  const peopleHeading = peopleCount === 1 ? "1 team member" : `${peopleCount} team members`;
  const heading = trainings.length === 1 ?
    `1 training session has expired for ${peopleHeading}` :
    `${trainings.length} training sessions have expired for ${peopleHeading}`;
  const options = {};
  if (sendNotifications) {
    options.next = {
      actionName: "notifyList",
      args: [{
        name: "trainingListData",
        value: JSON.stringify(trainings)
      }, {
        name: "notificationCount",
        value: "0"
      }]
    };
  }
  ellipsis.success({
    thresholdDate: thresholdDate,
    hasExpiredTrainings: trainings.length > 0,
    expiryHeading: heading,
    hasWarnings: warnings.length > 0,
    expiredString: formattedList,
    warningString: warnings.join("\n")
  }, options);
});
}
