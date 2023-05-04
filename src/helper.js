import * as fsPromise from "fs/promises";
import * as fs from "fs";
export const getQueryJson = (query) => {
  const queries =
    query.indexOf("&") !== -1
      ? query.split("=").join("&").split("&")
      : query.split("=");
  console.log("queries", queries);
  const queryJson = {};
  for (let i = 0; i < queries.length; i += 2) {
    console.log(i);
    queryJson[queries[i]] = queries[i + 1];
  }
  return queryJson;
};

export const handleResponseSend = async (res, message, code) => {
  console.log("code", code);
  res.statusCode = code;
  res.end(JSON.stringify({ message }));
};

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

const dbFilePath = "./db/db.json";

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

export const writeDataInDb = async (data, res) => {
  try {
    return await fsPromise.writeFile(dbFilePath, data, { encoding: "utf-8" });
  } catch (error) {
    console.log("error", error);
    return handleResponseSend(res, error.message, 500);
  }
};
