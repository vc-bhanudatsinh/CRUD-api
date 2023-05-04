import * as fsPromise from "fs/promises";
import * as fs from "fs";

/**
 * @function getQueryJson - convert query string into json
 * @param {string} query
 * @returns {json}
 */
export const getQueryJson = (query) => {
  const queries =
    query.indexOf("&") !== -1
      ? query.split("=").join("&").split("&")
      : query.split("=");
  const queryJson = {};
  for (let i = 0; i < queries.length; i += 2) {
    queryJson[queries[i]] = queries[i + 1];
  }
  return queryJson;
};

/**
 * @function handleResponseSend - common function to handle error or success response to send to client
 * @param {object} res - response to send to client
 * @param {string} message - message to send in response
 * @param {number} code - status code to send in response
 * @returns {promise}
 */
export const handleResponseSend = async (res, message, code) => {
  res.statusCode = code;
  return res.end(JSON.stringify({ message }));
};

/**
 * @function setHeaders - common function to set header
 * @param {string} method - content type catrgory to be set
 * @param {object} res - response to send to client
 * @returns {void}
 */
export const setHeaders = async (method, res) => {
  switch (method) {
    case "json":
      res.setHeader("Content-Type", "text/json");
      break;
    default:
      console.log("reached to default");
  }
  return;
};

// database file path
const dbFilePath = "./db/db.json";

/**
 * @function getFileData - get data from db file
 * @param {object} res - response to send to client
 * @returns {json} - db data read from file
 */
export const getFileData = async (res) => {
  try {
    // check file exists or not
    if (!fs.existsSync(dbFilePath)) {
      // create a file for user data
      await fsPromise.writeFile(dbFilePath, "[]", { encoding: "utf-8" });
    }

    // return users data from file.
    let fileData = await fsPromise.readFile(dbFilePath, {
      encoding: "utf-8",
    });
    return (fileData = JSON.parse(fileData));
  } catch (error) {
    console.log("getFileData error", error.message);
    return handleResponseSend(res, error.message, 500);
  }
};

/**
 * @function writeDataInDb - write data in db file
 * @param {json} data - updated data to be written in file
 * @param {object} res - response to send to client
 * @returns {promise}
 */
export const writeDataInDb = async (data, res) => {
  try {
    return await fsPromise.writeFile(dbFilePath, data, { encoding: "utf-8" });
  } catch (error) {
    console.log("error", error);
    return handleResponseSend(res, error.message, 500);
  }
};
