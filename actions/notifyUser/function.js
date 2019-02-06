function(trainingListData, ellipsis) {
  const Training = require('Training');
const trainingList = Training.listFromString(trainingListData);
const sessionCount = trainingList.length;
const heading = sessionCount === 1 ? 
  `This is a notification that you have 1 expired training session:` :
  `This is a notification that you have ${sessionCount} expired training sessions`;
ellipsis.success({
  heading: heading,
  list: trainingList.map((ea) => ea.formatTopicAndDate()).join("\n")
}, {
  choices: [{
    actionName: "submitSessionUpdate",
    label: "Update session date",
    allowMultipleSelections: true
  }]
});
}
