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

    //create

    // delete

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