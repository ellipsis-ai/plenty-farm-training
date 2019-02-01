/*
@exportId gLIC9DsJRSi8SkfKfQQ4vw
*/
module.exports = (function() {
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const letters = ALPHABET.split("");
const columnLabels = letters.slice();
letters.forEach((outerLetter) => {
  letters.forEach((innerLetter) => {
    columnLabels.push(outerLetter + innerLetter);
  });
});

return {
  at: function(columnIndex, rowIndex) {
    return `${columnLabels[columnIndex]}${rowIndex + 1}`;
  }
}

})()
     