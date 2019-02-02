/*
@exportId Ci5hvbQHT76wB815K-lC2Q
*/
module.exports = (function() {
class Training {
  constructor(name, email, topic, date, cellLabel) {
    this.name = (name || "").trim();
    this.email = (email || "").trim();
    this.topic = (topic || "").trim();
    this.date = date.trim();
    this.cellLabel = cellLabel;
  }

  formatName() {
    return this.name || "(Unknown name)";
  }

  formatEmail() {
    return this.email ? `<${this.email}>` : "(unknown email)";
  }

  formatTopic() {
    return this.topic || "_(No topic details)_";
  }

  format() {
    return `**${this.formatName()}** ${this.formatEmail()}
${this.formatTopicAndDate()}
`;
  }

  formatTopicAndDate() {
    return `${this.date}: ${this.formatTopic()}`;
  }

  formatPersonAndDate() {
    return `${this.date}: ${this.formatName()} ${this.formatEmail()}`
  }

  static listFromString(trainingListJsonString) {
    const list = JSON.parse(trainingListJsonString);
    if (!Array.isArray(list)) {
      throw new Error("Invalid training session list data");
    }
    return list.map((obj) => new Training(obj.name, obj.email, obj.topic, obj.date, obj.cellLabel));
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

  static groupByTopic(trainings) {
    const groups = {};
    trainings.forEach((training) => {
      const topic = training.topic || "Unknown topic";
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

  validate() {
    if (!this.name && !this.email && !this.topic) {
      return `- Missing name, email and topic for training date at index ${this.cellLabel}`;
    } else if (!this.name && !this.email) {
      return `- Missing name and email for training date at index ${this.cellLabel}`;
    } else if (!this.name && !this.topic) {
      return `- Missing name and topic for training date at index ${this.cellLabel}`;
    } else if (!this.email && !this.topic) {
      return `- Missing email and topic for training date at index ${this.cellLabel}`;
    } else if (!this.name) {
      return `- Missing name for training date at index ${this.cellLabel}`;
    } else if (!this.email) {
      return `- Missing email for training date at index ${this.cellLabel}`;
    } else if (!this.topic) {
      return `- Missing topic for training date at index ${this.cellLabel}`;
    } else {
      return null;
    }
  }

  static formatList(trainings) {
    const groups = Training.groupByTopic(trainings);
    return groups.map((group) => {
      return `**${group.topic}**:
${group.trainings.map((ea) => `- ${ea.formatPersonAndDate()}`).join("\n")}`;
    }).join("\n\n");
  }

  static validateList(trainings) {
    return trainings.map((ea) => ea.validate()).filter((ea) => Boolean(ea));
  }
}

return Training;
})()
     