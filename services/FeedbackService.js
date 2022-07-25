const fs = require('fs');
const util = require('util');
const converter = require('json-2-csv')

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

   */
  async addEntry(name, email, phoneNumber, dateOfParty) {
    const data = (await this.getData()) || [];
    data.unshift({ name, email, phoneNumber, dateOfParty });
    return writeFile(this.datafile, JSON.stringify(data));
  }

  /**
   * Fetches feedback data from the JSON file provided to the constructor
   */
  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    if (!data) return [];
    return JSON.parse(data);
  }

  async exportToCSV() {
    const data = await readFile(this.datafile, 'utf-8')
    if (!data) return [];
    converter.csv2jsonAsync(data)
      .then(writeFile(this.datafile, JSON.stringify(data)))
      .catch((err) => console.log('ERROR: ' + err.message));
    return
  }
}

module.exports = FeedbackService;
