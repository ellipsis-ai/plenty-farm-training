function(trainingData, user, sheet, ellipsis) {
  const Training = require('Training');
const training = Training.fromString(trainingData);
ellipsis.success(`
${user} submitted a new date for a completed training session:

${training.formatTopicAndDate()}
`, {
  choices: [{
    actionName: "saveUpdatedSession",
    label: "Confirm update",
    allowOthers: true,
    args: [{
      name: "trainingData",
      value: trainingData
    }, {
      name: "sheet",
      value: sheet.name
    }]
  }]
});
}
