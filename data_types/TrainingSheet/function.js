function(ellipsis) {
  const sheetNames = require('sheet-names');
ellipsis.success(sheetNames.map((ea) => Object.assign({}, ea, {
  id: ea.name,
  label: ea.name
})));
}
