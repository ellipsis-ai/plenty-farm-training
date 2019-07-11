function(sheet, trainingData, ellipsis) {
  const Training = require('Training');
const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis).actions;
const training = Training.fromString(trainingData);
const managerId = ellipsis.env.SSF_FARM_TRAINING_MANAGER_ID;
api.run({
  actionName: "announceSessionUpdate",
  channel: sheet.channel,
  args: [{
    name: "trainingData",
    value: JSON.stringify(training)
  }, {
    name: "user",
    value: ellipsis.event.user.formattedLink
  }, {
    name: "sheet",
    value: sheet.name
  }]
}).then(() => {
  ellipsis.success({
    sessionName: training.formatTopic(),
    newDate: training.date,
    managerId: managerId
  }, {
    choices: [{
      actionName: "checkUserListAndUpdate",
      label: "Update another session date",
      allowMultipleSelections: true,
      allowOthers: true,
      args: [{
        name: "trainingListData",
        value: "[]"
      }, {
        name: "sheet",
        value: sheet.name
      }]
    }]
  });
});
}
