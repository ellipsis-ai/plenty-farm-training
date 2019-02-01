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

  format() {
    return `**${this.name || "(Unknown name)"}** <${this.email || "unknown email"}>
${this.formatTopicAndDate()}
`;
  }

  formatTopicAndDate() {
    return `${this.date}: ${this.topic || "_(No topic details)_"}`;
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
    const groups = Training.groupByEmail(trainings);
    return groups.map((group) => {
      return `**${group.name}** <${group.email}>:
${group.trainings.map((ea) => `- ${ea.formatTopicAndDate()}`).join("\n")}`;
    }).join("\n\n");
  }

  static validateList(trainings) {
    return trainings.map((ea) => ea.validate()).filter((ea) => Boolean(ea));
  }
}

return Training;
})()
     