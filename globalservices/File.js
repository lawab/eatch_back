const fs = require("fs");
const path = require("path");
const { jsonFilesPath } = require("../globalConfig");
/**
 * class to manage files
 */
module.exports = class File {
  dest = "";
  fs = null;
  constructor(dest = "") {
    this.dest = dest || jsonFilesPath;
    this.fs = fs;
  }

  createReadStream(filename = "") {
    try {
      let stream = this.fs.createReadStream(path.join(this.dest, filename));
      return stream;
    } catch (error) {
      throw new Error(error);
    }
  }

  createWriteStream(filename = "") {
    try {
      let stream = this.fs.createWriteStream(path.join(this.dest, filename));
      return stream;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  createFile(filename = "") {
    try {
      this.createWriteStream(filename);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  /**
   *
   * @param {String} filename [filename that we want to read content]
   * @returns {Promise<String>} [content of file read]
   */
  async read(filename = "") {
    return new Promise((resolve, reject) => {
      let data = "";
      try {
        let stream = this.createReadStream(filename);
        stream.on("data", (chunk) => {
          data += chunk.toString();
        });
        stream.on("end", (chunk) => {
          resolve(data);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   *
   * @param {String} filename [filename that we want to write in]
   * @param {*String} content [content that we want to write into filename]
   * @returns {Promise<String>} [content of file write]
   */
  async writeToFile(filename = "", content = "") {
    return new Promise(async (resolve, reject) => {
      try {
        let writeStream = this.createWriteStream(filename);

        writeStream.write(content, () => {
          resolve(content);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
};
