const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class FBResultService {
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


    // update
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
    async addEntry(entry, name, email, phoneNumber, dateOfParty, receivePromos, receiveTexts) {
        console.log("adding entry to results page")
        const data = (await this.getData()) || [];
        data.unshift({ entry, name, email, phoneNumber, dateOfParty, receivePromos, receiveTexts });
        // await this.exportToCSV()
        return writeFile(this.datafile, JSON.stringify(data));
    }


    //update entry

    //delete entry
    async removeEntry(entry){
        console.log("removing id: "+ entry)
        const data = (await this.getData()) || [];
        data.splice(data.findIndex(function(i){
            return i.entry === entry;
        }), 1);
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

}

module.exports = FBResultService