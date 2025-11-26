import { formatResponse } from "./format.js";

export const handleRouteErrors = (res, { error, statusCode }) => {
  console.error(error);
  return res
    .status(statusCode || 500)
    .json(formatResponse(null, false, "Server error"));
};
