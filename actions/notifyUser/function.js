function(trainingListData, sheet, ellipsis) {
  const Training = require('Training');
const trainingList = Training.listFromString(trainingListData);
const sessionCount = trainingList.length;
const heading = sessionCount === 1 ? 
  `This is a notification that you have 1 expired training session for **${sheet.name}**:` :
  `This is a notification that you have ${sessionCount} expired training sessions for **${sheet.name}**`;
ellipsis.success({
  heading: heading,
  list: trainingList.map((ea, index) => `${index + 1}. ${ea.formatCategoryTopicDate()}`).join("\n")
}, {
  choices: [{
    actionName: "checkUserListAndUpdate",
    label: "Update session date",
    allowMultipleSelections: true,
    allowOthers: true,
    args: [{
      name: "trainingListData",
      value: JSON.stringify(trainingList)
    }, {
      name: "sheet",
      value: sheet.name
    }]
  }]
});
}
