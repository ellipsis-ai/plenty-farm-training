function(session, date, ellipsis) {
  const moment = require('moment-timezone');
const Training = require('Training');
const mdy = moment(date).format(Training.DATE_FORMAT);
const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis).actions;
const training = Training.fromProps(session).clone({
  date: mdy
});
api.run({
  actionName: "announceSessionUpdate",
  channel: ellipsis.env.SSF_FARM_TRAINING_ALERT_CHANNEL,
  args: [{
    name: "trainingData",
    value: JSON.stringify(training)
  }, {
    name: "user",
    value: ellipsis.event.user.formattedLink
  }]
}).then(() => {
  ellipsis.success({
    sessionName: session.label,
    newDate: mdy
  }, {
    choices: [{
      actionName: "submitSessionUpdate",
      label: "Update another session date",
      allowMultipleSelections: true
    }]
  });
});
}
