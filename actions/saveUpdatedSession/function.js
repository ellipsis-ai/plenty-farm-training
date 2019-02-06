function(trainingData, ellipsis) {
  const Training = require('Training');
const training = Training.fromString(trainingData);
ellipsis.success(require('util').inspect(training));
}
