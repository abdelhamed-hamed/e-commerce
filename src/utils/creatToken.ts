import jwt from "jsonwebtoken";

class Tokens {
  creatToken = (id: any, role: string) =>
    jwt.sign({ _id: id, role }, process.env.JWT_SECRET_KEY!, {
      expiresIn: process.env.JWT_EXPIRED!,
    });
}
const tokens = new Tokens();
export default tokens;
