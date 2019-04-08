function(sheet, ellipsis) {
  const sheetNames = require("sheet-names");
ellipsis.success("", {
  next: {
    actionName: sheet.submitAction,
    args: [{
      name: "sheet",
      value: sheet.name
    }]
  }
});
}
