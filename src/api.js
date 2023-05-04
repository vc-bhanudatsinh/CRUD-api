import * as url from "url";
import * as helper from "./helper.js";

/**
 * @function getSingleUserApi - GET single user data from db
 * @param {object} req - request from client
 * @param {object} res - response to send to client
 * @returns {promise}
 */
export const getSingleUserApi = async (req, res) => {
  try {
    const urlParser = url.parse(req.url);
    const query = urlParser.query;
    if (!query) return helper.handleResponseSend(res, "No params Found", 404);
    const queryJson = helper.getQueryJson(query);
    if (!queryJson.email)
      return helper.handleResponseSend(res, "params are incorrect", 409);
    let db = await helper.getFileData(res);
    const findUser = db.find((user) => user.email === queryJson.email);
    if (!findUser) return helper.handleResponseSend(res, "User not found", 404);
    return res.end(JSON.stringify(findUser));
  } catch (error) {
    console.log("error", error);
    return helper.handleResponseSend(res, error.message, 500);
  }
};

/**
 * @function getAllUsersApi - GET all users data from db
 * @param {object} req - request from client
 * @param {object} res - request from client
 * @returns {promise}
 */
export const getAllUsersApi = async (req, res) => {
  try {
    // read data from db file
    const db = await helper.getFileData(res);
    res.end(JSON.stringify(db));
  } catch (error) {
    console.log("error", error);
    return helper.handleResponseSend(res, error.message, 500);
  }
};

/**
 * @function deleteUserApi - DELETE user by email
 * @param {object} req - request from client
 * @param {object} res - response to send to client
 * @returns {promise}
 */
export const deleteUserApi = async (req, res) => {
  try {
    const urlParser = url.parse(req.url);
    const query = urlParser.query;

    // check for any params
    if (!query) return helper.handleResponseSend(res, "No params Found", 404);

    // convert string params into object
    const queryJson = helper.getQueryJson(query);

    // check for email in params
    if (!queryJson.email)
      return helper.handleResponseSend(res, "params are incorrect", 409);

    // read db data from file
    let db = await helper.getFileData(res);

    // delete user by email id
    db = db.filter((user) => user.email !== queryJson.email);

    // write updated data in db
    await helper.writeDataInDb(JSON.stringify(db), res);
    return helper.handleResponseSend(res, "User deleted Successfully", 200);
  } catch (error) {
    console.log("error", error);
    return helper.handleResponseSend(res, error.message, 500);
  }
};

/**
 * @function updateUserApi - UPDATE user data by email
 * @param {object} req - request from client
 * @param {object} res - response to send to client
 * @returns {promise}
 */
export const updateUserApi = async (req, res) => {
  try {
    // event listener on request containing data
    req.on("data", async (data) => {
      data = JSON.parse(data.toString());
      const { email, name, age, newEmail } = data;

      // check for body params
      if (!email || (!name && !newEmail && !age))
        return helper.handleResponseSend(
          res,
          "Some Body parameters are missing",
          404
        );
      // get data from db
      const db = await helper.getFileData(res);

      // check for user email in db
      const isEmailPresent = db.find((user) => user.email === email);
      if (!isEmailPresent)
        // send error if email not found in db
        return helper.handleResponseSend(res, "Email Id not found", 404);

      // check for new email in db
      const isEmailUnique = db.find((user) => user.email === newEmail);
      if (newEmail && isEmailUnique)
        // error if new email already exist in db
        return helper.handleResponseSend(res, "Duplicate new Email Id", 409);

      // updating user data
      db.find((user) => {
        if (user.email === email) {
          console.log("user", user);
          name ? (user.name = name) : null;
          age ? (user.age = age) : null;
          newEmail ? (user.email = newEmail) : null;
        }
      });

      // writing updated data in db file
      await helper.writeDataInDb(JSON.stringify(db), res);
      return helper.handleResponseSend(res, "User Updated Successfully", 200);
    });
  } catch (error) {
    console.log("error", error);
    return helper.handleResponseSend(res, error.message, 500);
  }
};

/**
 * @function createUserApi - CREATE user in db
 * @param {object} req
 * @param {object} res
 * @returns {promise}
 */
export const createUserApi = async (req, res) => {
  try {
    req.on("data", async (data) => {
      data = JSON.parse(data.toString());
      const { email, name, age } = data;

      // check for proper body params
      if (!email || !name || !age)
        return helper.handleResponseSend(
          res,
          "Some Body parameters are missing",
          404
        );

      // reading file data from db
      const db = await helper.getFileData(res);

      // check for email already exist in db
      const isEmailUnique = db.find((user) => user.email === email);
      if (isEmailUnique)
        // send error message for duplicate email
        return helper.handleResponseSend(res, "Duplicate Email Id", 409);

      // push new user in db data
      db.push({ email, name, age });

      // writing updated data in db file
      await helper.writeDataInDb(JSON.stringify(db), res);
      return helper.handleResponseSend(res, "User added Successfully", 200);
    });
  } catch (error) {
    console.log("error", error);
    return helper.handleResponseSend(res, error.message, 500);
  }
};
