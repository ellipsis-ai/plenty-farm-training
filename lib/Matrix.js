/*
@exportId Dj3guweXTrS_E1qdCm3x9Q
*/
module.exports = (function() {
const moment = require('moment-timezone');
const Training = require('Training');
const CellLabel = require('CellLabel');

const NAME_ROW_INDEX = 2;
const CATEGORY_COLUMN_INDEX = 0;
const SUBCATEGORY_COLUMN_INDEX = 1;
const TOPIC_COLUMN_INDEX = 2;
const DATA_ROWS_START_INDEX = 4;
const DATA_COLUMNS_START_INDEX = 4;
const PERSON_COLUMN_INTERVAL = 2;
const NAME_CELL_OFFSET = 0;
const TRAINING_DATE_CELL_OFFSET = 1;
const EMAIL_CELL_OFFSET = 1;
const DATE_REGEX = /\d+\/\d+\/\d+/;

class Matrix {
  constructor(rows) {
    this.rows = rows;
  }
  
  getDataRows() {
    return this.rows.slice(DATA_ROWS_START_INDEX);
  }

  getPersonDataColumns() {
    return this.rows[NAME_ROW_INDEX].slice(DATA_COLUMNS_START_INDEX);
  }

  cellLabelForDataIndex(columnIndex, rowIndex) {
    return CellLabel.at(columnIndex + DATA_COLUMNS_START_INDEX, rowIndex + DATA_ROWS_START_INDEX);
  }

  validateTrainingDates() {
    const warnings = [];
    this.getDataRows().forEach((row, rowIndex) => {
      const dataCells = row.slice(DATA_COLUMNS_START_INDEX);
      dataCells.forEach((cell, cellIndex) => {
        const trimmed = (cell || "").trim();
        const isDate = DATE_REGEX.test(trimmed);
        const isExpectedColumn = cellIndex % PERSON_COLUMN_INTERVAL === TRAINING_DATE_CELL_OFFSET;
        if (isDate && !isExpectedColumn) {
          warnings.push(`- Training date found in unexpected column: ${this.cellLabelForDataIndex(cellIndex, rowIndex)}`);
        }
      });
    });
    return warnings;
  }

  getOldTrainings(numDaysThreshold, today, timeZone) {
    const boundary = today.clone().subtract(numDaysThreshold, 'days');
    const personDataColumns = this.getPersonDataColumns();
    const dataRows = this.getDataRows();
    const matches = [];
    dataRows.forEach((row, rowIndex) => {
      const topic = row[TOPIC_COLUMN_INDEX];
      const category = this.getCategoryForDataRowIndex(rowIndex);
      const subcategory = topic ? this.getSubcategoryForDataRowIndex(rowIndex) : "";
      const dataCells = row.slice(DATA_COLUMNS_START_INDEX);
      for (let dataCellIndex = 0; dataCellIndex + 1 < dataCells.length; dataCellIndex += PERSON_COLUMN_INTERVAL) {
        const trainingColumnIndex = dataCellIndex + TRAINING_DATE_CELL_OFFSET;
        const trainingDate = (dataCells[trainingColumnIndex] || "").trim();
        if (trainingDate && DATE_REGEX.test(trainingDate)) {
          const trainingMoment = moment.tz(trainingDate, "M/D/YYYY", "M/D/YY", timeZone).startOf('day');
          if (trainingMoment.isBefore(boundary)) {
            const name = personDataColumns[dataCellIndex + NAME_CELL_OFFSET];
            const email = personDataColumns[dataCellIndex + EMAIL_CELL_OFFSET];
            const training = new Training(name, email, category, subcategory, topic, trainingMoment.format(Training.DATE_FORMAT), this.cellLabelForDataIndex(trainingColumnIndex, rowIndex));
            matches.push(training);
          }
        }
      }
    });
    return matches;
  }

  getCategoryForDataRowIndex(dataRowIndex) {
    const dataRows = this.getDataRows();
    let category;
    let i = dataRowIndex;
    while (!category && i >= 0) {
      category = dataRows[i][CATEGORY_COLUMN_INDEX];
      i--;
    }
    return category || "(Unknown category)";
  }

  getSubcategoryForDataRowIndex(dataRowIndex) {
    const dataRows = this.getDataRows();
    let category, subcategory;
    let i = dataRowIndex;
    while (!category && !subcategory && i >= 0) {
      category = dataRows[i][CATEGORY_COLUMN_INDEX];
      subcategory = dataRows[i][SUBCATEGORY_COLUMN_INDEX];
      i--;
    }
    return subcategory || "";
  }
}

return Matrix;
})()
     