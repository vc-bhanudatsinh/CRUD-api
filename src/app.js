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

const apiRequests = async (req, res) => {
  const method = req.method;
  const urlParse = url.parse(req.url);
  helper.setHeaders("json", res);
  if (urlParse.pathname !== "/users/" && urlParse.pathname !== "/users")
    return helper.handleResponseSend(res, "Url path is invalid", 409);
  switch (method) {
    case "GET":
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
      return helper.handleResponseSend(res, "Method is invalid", 409);
  }
};

const server = http
  .createServer(apiRequests)
  .listen(4000, () => console.log("Server is running on --- ", 4000));
