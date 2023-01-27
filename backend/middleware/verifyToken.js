import jwt from "jsonwebtoken";

export const verifyToken = async(req, res, next) => {
  const header = req.headers["authorization"];
  console.log(header);
  const token = header && header.split(" ")[1];
  console.log(token);
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) return res.sendStatus(403);
    console.log(decode);
    req.email = decode.email;
    next();
  });
};