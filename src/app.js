import * as http from "http";
import * as url from "url";
import * as helper from "./helper.js";
import {
  getSingleUserApi,
  getAllUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
} from "./api.js";

/**
 * @function apiRequests - handle request coming from client
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
const apiRequests = async (req, res) => {
  const method = req.method;
  const urlParse = url.parse(req.url);

  // set json content type
  helper.setHeaders("json", res);

  // check for valid url
  if (urlParse.pathname !== "/users/" && urlParse.pathname !== "/users")
    return helper.handleResponseSend(res, "Url path is invalid", 409);

  // switch case for different method types on users
  switch (method) {
    case "GET":
      // condition for get all users and single user
      if (urlParse.path === "/users") return getAllUsersApi(req, res);
      getSingleUserApi(req, res);
      break;
    case "DELETE":
      deleteUserApi(req, res);
      break;
    case "PUT":
      updateUserApi(req, res);
      break;
    case "POST":
      createUserApi(req, res);
      break;
    default:
      console.log("Method is invalid");
      // return invalid method for other methods than above
      return helper.handleResponseSend(res, "Method is invalid", 409);
  }
};

// creating a server
http
  .createServer(apiRequests)
  .listen(4000, () => console.log("Server is running on --- ", 4000));
