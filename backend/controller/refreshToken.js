import Users from "../model/UsersModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) => {
  try {
    const refreshToken = req.cookies['refreshToken'];  
    if (!refreshToken) return res.sendStatus(401);
    const user = await Users.findOne({
      where: {
        refresh_token: refreshToken
      }
    });
    if (!user) return res.sendStatus(404);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, result) => {
      if (err) return res.sendStatus(403);
      console.log(result);
      const userId = result.id; 
      const name = result.name;
      const email = result.email;
      const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30s'
      });
      res.json({ accessToken }); 
    });
  } catch (error) {
    console.log(error);
  }
};