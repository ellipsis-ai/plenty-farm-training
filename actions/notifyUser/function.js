function(trainingListData, sheet, ellipsis) {
  const Training = require('Training');
const trainingList = Training.listFromString(trainingListData);
const sessionCount = trainingList.length;
const heading = sessionCount === 1 ? 
  `This is a notification that you have 1 expired training session:` :
  `This is a notification that you have ${sessionCount} expired training sessions`;
ellipsis.success({
  heading: heading,
  list: trainingList.map((ea, index) => `${index + 1}. ${ea.formatCategoryTopicDate()}`).join("\n")
}, {
  choices: [{
    actionName: "checkUserListAndUpdate",
    label: "Update session date",
    allowMultipleSelections: true,
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
