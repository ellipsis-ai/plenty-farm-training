/*
@exportId Ci5hvbQHT76wB815K-lC2Q
*/
module.exports = (function() {
class Training {
  constructor(name, email, topic, date) {
    this.name = (name || "").trim();
    this.email = (email || "").trim();
    this.topic = (topic || "").trim();
    this.date = date.trim();
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

  static formatList(trainings) {
    const groups = Training.groupByEmail(trainings);
    return groups.map((group) => {
      return `**${group.name}** <${group.email}>:
${group.trainings.map((ea) => `- ${ea.formatTopicAndDate()}`).join("\n")}`;
    }).join("\n\n");
  }
}

return Training;
})()
     