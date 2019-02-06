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
  if (matches.length === 0) {
    return ellipsis.error(`No expired sessions found for email ${email}`, {
      userMessage: "No expired training sessions were found for you."
    });
  } else {
    const heading = matches.length === 1 ? "There is 1 expired training session on file for you:" : `There are ${matches.length} expired training sessions on file for you:`;
    const matchList = matches.map((ea, index) => {
      return `${index + 1}. ${ea.category ? `**${ea.category}**: ` : ""}${ea.formatTopic()} (last completed ${ea.date})`;
    }).join("\n");
    const matchResult = matches.map((ea) => {
      const label = `${ea.formatTopic()}`;
      const obj = Object.assign({}, ea, {
        id: ea.cellLabel,
        label: label
      });
      return obj;
    });
    return api.say({
      message: `${heading}
${matchList}`
    }).then(() => {
      ellipsis.success(matchResult);
    }).catch(() => { // Ignore errors from say() since it's not strictly necessary
      ellipsis.success(matchResult);
    });
  }
});
}
