function(trainingListData, notificationCount, sheet, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const Training = require('Training');
const inspect = require('util').inspect;

const trainingList = Training.listFromString(trainingListData);
const groups = Training.groupByEmail(trainingList);
const api = new EllipsisApi(ellipsis);

let warning = "";
const trainingGroup = groups.pop();
const email = trainingGroup.email;
new Promise((resolve, reject) => {
  if (!email || !email.includes("@")) {
    const inspection = inspect(trainingGroup);
    throw new ellipsis.Error(`Warning: no valid email for training sessions:
  ${inspection}`);
  } else {
    resolve(email);
  }
}).then((email) => {
  return api.users.findUserByEmail(email);
}).then((result) => {
  const users = result.users;
  if (!users || !users.length) {
    throw new ellipsis.Error(`No valid user found for email ${email}`);
  }
  const userId = users[0].userIdForContext;
  return api.actions.run({
    actionName: "notifyUser",
    channel: userId,
    args: [{
      name: "trainingListData",
      value: JSON.stringify(trainingGroup.trainings)
    }, {
      name: "sheet",
      value: sheet.name
    }]
  }); 
}).catch((err) => {
  warning = `Warning: I couldn't send a notification to user ${trainingGroup.name} <${email}>. [${err.message}]`;
}).then(() => {
  notificationCount += 1;
  const options = {};
  const remainingList = trainingList.filter((ea) => ea.email !== email);
  if (remainingList.length === trainingList.length) {
    throw new ellipsis.Error(`Error pruning notification list during attempt to send to "${email}". Halting notifications to avoid endless loop. Remaining list:

${inspect(remainingList)}`, {
      userMessage: "An error occurred while trying to send notifications."
    });
  } else if (remainingList.length > 0) {
    options.next = {
      actionName: "notifyList",
      args: [{
        name: "trainingListData",
        value: JSON.stringify(remainingList)
      }, {
        name: "notificationCount",
        value: String(notificationCount)
      }, {
        name: "sheet",
        value: sheet.name
      }]
    }
  } else if (remainingList.length === 0) {
    warning += "\n\n" + (notificationCount === 1 ? "1 notification sent." : `${notificationCount} notifications sent.`);
  }
  ellipsis.success(warning, options);
});
}
