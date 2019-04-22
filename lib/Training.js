/*
@exportId Ci5hvbQHT76wB815K-lC2Q
*/
module.exports = (function() {
const moment = require('moment-timezone');
const deepEqual = require('deep-equal');

const OPTIONAL_FIELDS = ['name', 'email', 'category', 'subcategory', 'topic'];

class Training {
  constructor(name, email, category, subcategory, topic, date, cellLabel, expiryDays) {
    this.name = (name || "").trim();
    this.email = (email || "").trim();
    this.category = (category || "").trim();
    this.subcategory = (subcategory || "").trim();
    this.topic = (topic || "").trim();
    this.date = date.trim();
    this.cellLabel = cellLabel;
    this.expiryDays = expiryDays;
  }

  clone(newProps) {
    const props = Object.assign({}, this, newProps);
    return Training.fromProps(props);
  }

  isEqualTo(otherTraining) {
    return deepEqual(this, otherTraining);
  }

  static fromProps(props) {
    return new Training(props.name, props.email, props.category, props.subcategory, props.topic, props.date, props.cellLabel, props.expiryDays);
  }

  static fromString(trainingJsonString) {
    const props = JSON.parse(trainingJsonString);
    return Training.fromProps(props);
  }

  static listFromString(trainingListJsonString) {
    const list = JSON.parse(trainingListJsonString);
    if (!Array.isArray(list)) {
      throw new Error("Invalid training session list data");
    }
    return list.map((obj) => Training.fromProps(obj));
  }

  formatName() {
    return this.name || "(Unknown name)";
  }

  formatEmail() {
    return this.email ? `<${this.email}>` : "(unknown email)";
  }

  formatCategory() {
    return `**${this.category || "Unknown category"}**`;
  }

  formatTopic() {
    const combined = [this.subcategory, this.topic].filter((ea) => Boolean(ea)).join(", ");
    return combined || "_(No topic details)_";
  }

  format() {
    return `**${this.formatName()}** ${this.formatEmail()}
${this.formatTopicAndDate()}
`;
  }

  formatTopicAndDate() {
    return `${this.date}: ${this.formatCategory()} - ${this.formatTopic()}`;
  }

  formatCategoryTopicDate() {
    return `${this.formatCategoryTopic()} _(last completed ${this.date})_`;
  }

  formatCategoryTopic() {
    return `${this.category ? `**${this.category}**: ` : ""}${this.formatTopic()}`;
  }

  formatNameAndDate() {
    return `${this.date}: ${this.formatName()}`;
  }

  static groupByEmail(trainings) {
    const groups = {};
    trainings.forEach((training) => {
      const email = training.email || "Unknown email";
      if (!groups[email]) {
        groups[email] = [];
      }
      groups[email].push(training);
    });
    return Object.keys(groups).map((email) => {
      return {
        name: groups[email][0].name || "(Unknown name)",
        email: email,
        trainings: groups[email]
      };
    });
  }

  static groupByCategory(trainings) {
    const groups = {};
    trainings.forEach((training) => {
      const category = training.category || "Unknown category";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(training);
    });
    return Object.keys(groups).map((category) => {
      return {
        category: category,
        trainings: groups[category]
      };
    });
  }

  static groupByTopic(trainings) {
    const groups = {};
    trainings.forEach((training) => {
      const topic = training.formatTopic();
      if (!groups[topic]) {
        groups[topic] = [];
      }
      groups[topic].push(training);
    });
    return Object.keys(groups).map((topic) => {
      return {
        topic: topic,
        trainings: groups[topic]
      };
    });
  }

  static groupByDate(trainings) {
    const groups = {};
    trainings.forEach((training) => {
      const date = training.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(training);
    });
    return Object.keys(groups).sort((dateA, dateB) => {
      const m1 = moment(dateA, "M/D/YYYY");
      const m2 = moment(dateB, "M/D/YYYY");
      if (m1.isBefore(m2)) {
        return -1;
      } else if (m2.isBefore(m1)) {
        return 1;
      } else {
        return 0;
      }
    }).map((date) => {
      return {
        date: date,
        trainings: groups[date]
      };
    });
  }

  validate() {
    const missing = OPTIONAL_FIELDS.filter((field) => !this[field]);
    if (missing.length > 1) {
      const list = missing.slice(0, missing.length - 1).join(", ") + " and " + missing[missing.length - 1];
      return `- Missing ${list} for training date at index ${this.cellLabel}`;
    } else if (missing.length === 1) {
      return `- Missing ${missing[0]} for training date at index ${this.cellLabel}`;
    } else {
      return null;
    }
  }

  static formatList(trainings) {
    return Training.formatListByEmailCategoryDate(trainings);
  }

  static formatListByEmailCategoryDate(trainings) {
    const groupedByEmail = Training.groupByEmail(trainings);
    return groupedByEmail.map((emailGroup) => {
      const groupedByCategory = Training.groupByCategory(emailGroup.trainings);
      const categoryList = groupedByCategory.map((categoryGroup) => {
        const groupedByDate = Training.groupByDate(categoryGroup.trainings);
        const dateList = groupedByDate.map((dateGroup) => {
          const topics = dateGroup.trainings.map((ea) => ea.formatTopic()).join(" · ");
          return `- ${dateGroup.date}: ${topics}`;
        });
        return `_${categoryGroup.category}_\n` + dateList.join("\n");
      });
      return `**${emailGroup.name}**:\n` + categoryList.join("\n\n");
    }).join("\n\n");
  }

  static formatListByCategoryTopicDate(trainings) {
    const groups = Training.groupByCategory(trainings);
    return groups.map((categoryGroup) => {
      const groupedByTopic = Training.groupByTopic(categoryGroup.trainings);
      const topicList = groupedByTopic.map((topicGroup) => {
        const groupedByDate = Training.groupByDate(topicGroup.trainings);
        const dateList = groupedByDate.map((dateGroup) => {
          const names = dateGroup.trainings.map((ea) => ea.formatName()).join(", ");
          return `- ${dateGroup.date}: ${names}`;
        });
        return `_${topicGroup.topic}_\n` + dateList.join("\n");
      });
      return `**${categoryGroup.category}**:\n` + topicList.join("\n\n");
    }).join("\n\n");
  }

  static validateList(trainings) {
    return trainings.map((ea) => ea.validate()).filter((ea) => Boolean(ea));
  }
}

Training.DATE_FORMAT = 'M/D/YYYY';
Training.EXPIRY_THRESHOLD_IN_DAYS = 180;

return Training;
})()
     