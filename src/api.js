import * as url from "url";
import * as helper from "./helper.js";

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

export const getAllUsersApi = async (req, res) => {
  try {
    let db = await helper.getFileData(res);
    res.statusCode = 200;
    res.end(JSON.stringify(db));
  } catch (error) {
    console.log("error", error);
    return helper.handleResponseSend(res, error.message, 500);
  }
};

export const deleteUserApi = async (req, res) => {
  try {
    const urlParser = url.parse(req.url);
    const query = urlParser.query;
    if (!query) return helper.handleResponseSend(res, "No params Found", 404);
    const queryJson = helper.getQueryJson(query);
    if (!queryJson.email)
      return helper.handleResponseSend(res, "params are incorrect", 409);
    let db = await helper.getFileData(res);
    db = db.filter((user) => user.email !== queryJson.email);
    console.log("db", db);
    await helper.writeDataInDb(JSON.stringify(db), res);
    return helper.handleResponseSend(res, "User deleted Successfully", 200);
  } catch (error) {
    console.log("error", error);
    return helper.handleResponseSend(res, error.message, 500);
  }
};

export const updateUserApi = async (req, res) => {
  try {
    req.on("data", async (data) => {
      data = JSON.parse(data.toString());
      const { email, name, age, newEmail } = data;
      console.log(email, age, name, newEmail);
      if (!email || (!name && !newEmail && !age))
        return helper.handleResponseSend(
          res,
          "Some Body parameters are missing",
          404
        );
      let db = await helper.getFileData(res);
      const isEmailPresent = db.find((user) => user.email === email);
      console.log("isEmailPresent", isEmailPresent);
      if (!isEmailPresent)
        return helper.handleResponseSend(res, "Email Id not found", 404);
      if (newEmail) {
        const isEmailUnique = db.find((user) => user.email === newEmail);
        if (isEmailUnique)
          return helper.handleResponseSend(res, "Duplicate new Email Id", 409);
      }
      db.find((user) => {
        if (user.email === email) {
          console.log("user", user);
          name ? (user.name = name) : null;
          age ? (user.age = age) : null;
          newEmail ? (user.email = newEmail) : null;
        }
      });
      console.log("db", db);
      await helper.writeDataInDb(JSON.stringify(db), res);
      return helper.handleResponseSend(res, "User Updated Successfully", 200);
    });
  } catch (error) {
    console.log("error", error);
    return helper.handleResponseSend(res, error.message, 500);
  }
};

export const createUserApi = async (req, res) => {
  try {
    req.on("data", async (data) => {
      data = JSON.parse(data.toString());
      const { email, name, age } = data;
      if (!email || !name || !age)
        return helper.handleResponseSend(
          res,
          "Some Body parameters are missing",
          404
        );
      let db = await helper.getFileData(res);
      const isEmailUnique = db.find((user) => user.email === email);
      if (isEmailUnique)
        return helper.handleResponseSend(res, "Duplicate Email Id", 409);
      db.push({ email, name, age });
      console.log("db", db);
      await helper.writeDataInDb(JSON.stringify(db), res);
      return helper.handleResponseSend(res, "User added Successfully", 200);
    });
  } catch (error) {
    console.log("error", error);
    return helper.handleResponseSend(res, error.message, 500);
  }
};
