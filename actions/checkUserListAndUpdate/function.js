function(trainingListData, sheet, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const Training = require('Training');
const Matrix = require('Matrix');
const email = ellipsis.event.user.email;
const moment = require('moment-timezone');
const trainings = Training.listFromString(trainingListData);

if (!email) {
  ellipsis.error("No email address available for user while searching for training sessions", {
    userMessage: "An error occurred while searching for training sessions. Perhaps your email address is not set properly in your profile?"
  });
}

Matrix.loadData(ellipsis, sheet.name).then((matrix) => {
  const today = moment.tz(ellipsis.team.timeZone).startOf('day');
  const matches = matrix.getOldTrainings(Training.EXPIRY_THRESHOLD_IN_DAYS, today, ellipsis.team.timeZone).filter((training) => {
    return training.email === email;
  });
  let result = '';
  if (!matches.every((match, index) => match.isEqualTo(trainings[index]))) {
    result = `Here is an updated list of expired training sessions:

${matches.map((ea, index) => `${index + 1}. ${ea.formatCategoryTopicDate()}`).join("\n")}`;
  }
  ellipsis.success(result, {
    next: {
      actionName: "submitSessionUpdate",
      args: [{
        name: "sheet",
        value: sheet.name
      }]
    }
  });
});
}
