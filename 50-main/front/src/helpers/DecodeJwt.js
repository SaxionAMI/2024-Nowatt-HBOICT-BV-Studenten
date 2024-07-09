import {getCookie} from "./CookieHelper";

const parseJwt = (token) => {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

export const getDecodedJwt = () => {
  let token;
  try {
    token = getCookie("authorization");
    return parseJwt(token);
  } catch (ignored) {
    return undefined;
  }
}