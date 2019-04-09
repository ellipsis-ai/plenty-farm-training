function(sheet, session, date, ellipsis) {
  const moment = require('moment-timezone');
const Training = require('Training');
const mdy = moment(date).format(Training.DATE_FORMAT);
const training = Training.fromProps(session).clone({
  date: mdy
});
ellipsis.success("", {
  next: {
    actionName: "submitAnySessionUpdate",
    args: [{
      name: "sheet",
      value: sheet.name
    }, {
      name: "trainingData",
      value: JSON.stringify(training)
    }]
  }
});
}
