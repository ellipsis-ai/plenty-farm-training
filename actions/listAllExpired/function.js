function(sendNotifications, sheet, ellipsis) {
  const Matrix = require('Matrix');
const Training = require('Training');
const moment = require('moment-timezone');

Matrix.loadData(ellipsis, sheet.name).then((matrix) => {
  const today = moment.tz(ellipsis.team.timeZone).startOf('day');
  const trainings = matrix.getOldTrainings(Training.EXPIRY_THRESHOLD_IN_DAYS, today, ellipsis.team.timeZone);
  const matrixWarnings = matrix.validateTrainingDates();
  const peopleCount = new Set(trainings.map((ea) => ea.email)).size;
  const formattedList = Training.formatList(trainings);
  const trainingDataWarnings = Training.validateList(trainings);
  const warnings = matrixWarnings.concat(trainingDataWarnings);
  const thresholdDate = moment.tz(ellipsis.team.timeZone).subtract(Training.EXPIRY_THRESHOLD_IN_DAYS, 'days').format('M/D/YYYY');
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
      }, {
        name: "sheet",
        value: sheet.name
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
