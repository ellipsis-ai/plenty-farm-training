function(ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const Training = require('Training');
const Matrix = require('Matrix');
const api = new EllipsisApi(ellipsis).actions;
const email = ellipsis.event.user.email;
const moment = require('moment-timezone');
if (!email) {
  ellipsis.error("No email address available for user while searching for training sessions", {
    userMessage: "An error occurred while searching for training sessions. Perhaps your email address is not set properly in your profile?"
  });
}

Matrix.loadData(ellipsis).then((matrix) => {
  const today = moment.tz(ellipsis.team.timeZone).startOf('day');
  const matches = matrix.getOldTrainings(Training.EXPIRY_THRESHOLD_IN_DAYS, today, ellipsis.team.timeZone).filter((training) => {
    return training.email === email;
  });
  if (matches.length > 0) {
    ellipsis.success("Preparing your farm training session notifications…", {
      next: {
        actionName: "notifyUser",
        args: [{
          name: "trainingListData",
          value: JSON.stringify(matches)
        }]
      }
    });
  } else {
    ellipsis.success("You have no farm training session notifications.");
  }
});
}
