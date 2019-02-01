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
const PERSON_COLUMN_INTERVAL = 3;
const NAME_CELL_OFFSET = 0;
const TRAINING_DATE_CELL_OFFSET = 1;
const EMAIL_CELL_OFFSET = 2;

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

  getOldTrainings(numDaysThreshold) {
    const today = moment().startOf('day');
    const boundary = today.clone().subtract(numDaysThreshold, 'days');
    const personDataColumns = this.getPersonDataColumns();
    const dataRows = this.getDataRows();
    const matches = [];
    dataRows.forEach((row, rowIndex) => {
      const topic = row[TOPIC_COLUMN_INDEX];
      const category = this.getCategoryForDataRowIndex(rowIndex);
      const subcategory = topic ? this.getSubcategoryForDataRowIndex(rowIndex) : "";
      const topicTitle = [category, subcategory, topic].filter((ea) => Boolean(ea)).join(" - ");
      const dataCells = row.slice(DATA_COLUMNS_START_INDEX);
      for (let dataCellIndex = 0; dataCellIndex + 1 < dataCells.length; dataCellIndex += PERSON_COLUMN_INTERVAL) {
        const trainingColumnIndex = dataCellIndex + TRAINING_DATE_CELL_OFFSET;
        const trainingDate = dataCells[trainingColumnIndex];
        if (trainingDate) {
          const trainingMoment = moment(trainingDate, "M/D/YYYY").startOf('day');
          if (trainingMoment.isBefore(boundary)) {
            const name = personDataColumns[dataCellIndex + NAME_CELL_OFFSET];
            const email = personDataColumns[dataCellIndex + EMAIL_CELL_OFFSET];
            const training = new Training(name, email, topicTitle, trainingDate, this.cellLabelForDataIndex(trainingColumnIndex, rowIndex));
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
     