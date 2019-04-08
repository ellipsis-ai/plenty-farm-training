function(ellipsis) {
  const sheetNames = require('sheet-names');
ellipsis.success(sheetNames.map((ea) => ({
  id: ea.name,
  label: ea.name,
  name: ea.name
})));
}
