function(ellipsis) {
  const Matrix = require('Matrix');
const email = ellipsis.event.user.email;
if (!email) {
  ellipsis.error("No email address available for user while searching for training sessions", {
    userMessage: "An error occurred while searching for training sessions. Perhaps your email address is not set properly in your profile?"
  });
}

Matrix.loadData(ellipsis).then((matrix) => {
  const matches = matrix.getAllTrainings(ellipsis.team.timeZone).filter((training) => {
    return training.email === email;
  }).map((training) => {
    const label = `${training.formatTopic()}${training.category ? ` (${training.category})` : ""} · ${training.date}`;
    return {
      id: training.cellLabel,
      label: label
    };
  });
  if (matches.length === 0) {
    ellipsis.error(`No matching sessions found for email ${email}`, {
      userMessage: "No existing training sessions were found for you."
    });
  } else {
    ellipsis.success(matches);
  }
});
}
