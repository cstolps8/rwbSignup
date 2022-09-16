const fs = require('fs');
const util = require('util');
const converter = require('json-2-csv')
//const parser  = require('json2csv');



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
    console.log('getting list')
    const data = await this.getData();
    return data;
  }

  /**
   * Add a new feedback item
   * @param {*} name The name of the user

   */
  async addEntry(entry, name, email, phoneNumber, dateOfParty, receivePromos, receiveTexts ) {
    console.log("adding entry")
    const data = (await this.getData()) || [];
    console.log("last entry "+ data.entry)
    data.unshift({entry, name, email, phoneNumber, dateOfParty, receivePromos, receiveTexts  });
    await this.exportToCSV()
    return writeFile(this.datafile, JSON.stringify(data));
  }

  async deleteEntry(entry, name, email, phoneNumber, dateOfParty, receivePromos, receiveTexts ) {
    console.log("deleting entry")
    const data = (await this.getData()) || [];
    data.unshift({entry, name, email, phoneNumber, dateOfParty, receivePromos, receiveTexts  });
    await this.exportToCSV()
    // return writeFile(this.datafile, JSON.stringify(data));
  }

  /**
   * Fetches feedback data from the JSON file provided to the constructor
   */
  async getData() {
    console.log('getting JSON data')
    const data = await readFile(this.datafile, 'utf8');
    if (!data) return [];
    return JSON.parse(data);
  }

  async exportToCSV() {
    console.log("exporting csv")
    const csvfile = "./entries.csv"
    const data = await readFile(this.datafile, 'utf-8')
    console.log(data)
    if (!data) return [];

    converter.json2csv(JSON.parse(data), (err, csv) => {
      if (err) {
          throw err;
      }
      // print CSV string
      // csv.forEach(element => {
      //   console.log(csv);
        
      // });

    });
  


    return
  }

}

module.exports = FeedbackService;
