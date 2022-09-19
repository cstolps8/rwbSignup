const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

/**
 * Logic for reading and writing feedback data
 */
class FeedbackService {
  /**
   * Constructor
   * @param {*} datafile Path to a JSOn file that contains the feedback data
   */
  constructor(datafile) {
    this.datafile = datafile;
  }

  /**
   * Get all feedback items
   */
  async getList() {
    const data = await this.getData();
    return data;
  }

  /**
   * Add a new feedback item
   * @param {*} name The name of the user
   * @param {*} title The title of the feedback message
   * @param {*} message The feedback message
   */
  /**
   * Add a new feedback item
   * @param {*} name The name of the user

   */
   async addEntry(entry, name, email, phoneNumber, dateOfParty, receivePromos, receiveTexts ) {
    console.log("adding entry")
    const data = (await this.getData()) || [];
    console.log("last entry ")
    console.log (data)
    data.unshift({entry, name, email, phoneNumber, dateOfParty, receivePromos, receiveTexts  });
    // await this.exportToCSV()
    return writeFile(this.datafile, JSON.stringify(data));
  }

  async addEntryToCSV(entry, name, email, phoneNumber, dateOfParty, receivePromos, receiveTexts ){
    
  }
  /**
   * Fetches feedback data from the JSON file provided to the constructor
   */
  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    if (!data) return [];
    return JSON.parse(data);
  }
}

module.exports = FeedbackService;
