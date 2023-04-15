import jsonwebtoken from "jsonwebtoken";
const secret = process.env.SECRET || "tsitelecom";

function verifyToken(token: string) {
  try {
    const payload = jsonwebtoken.verify(token, secret);
    return payload;
  } catch (error) {
    return false;
  }
}
export default verifyToken;
