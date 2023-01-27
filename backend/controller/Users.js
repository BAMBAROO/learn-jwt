import bcrypt from "bcrypt";
import Users from "../model/UsersModel.js";
import jwt from "jsonwebtoken";

export const getUsers = async(req, res) => {
  console.log(req.email);
  try {
    const users = await Users.findAll({
      attributes:['id','name','email']
    });
    console.log(users)
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const Register = async(req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const exist = await Users.findOne({
    where: {
      email: email
    }
  });
  if (exist) return res.status(400).json({ msg: "email already exist."});
  if (password !== confirmPassword) return res.status(400).json({ msg: "password doesn't match."});
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashedPassword
    });
    res.json({ msg:"data has been added."});
  } catch (error) {
    console.log(error);
  }
};

export const Login = async(req, res) => {
  try {
    const user = await Users.findOne({ where: { email : req.body.email } });
    if (!user) return res.status(404).json({ msg: "email doesn't exist."});
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "wrong password." });
    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn:'40s'
    });
    const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn:'1d'
    });
    await Users.update({ refresh_token: refreshToken}, {
      where:{
        id: userId
      }
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false
    });
    res.json({ accessToken });
  } catch (error) {
    console.log(error);
  }
};

export const Logout = async(req, res) => {
  const refreshToken = req.cookies['refreshToken'];
  const user = await Users.findOne({
    where: {
      refresh_token: refreshToken
    }
  });
  if (!user) return res.sendStatus(204).json({msg: "user tidak ditemukan"});
  const userId = user.id;
  await Users.update({ refresh_token: null}, { 
    where: {
      id: userId
    }
  });
  res.clearCookie("refreshToken");
  res.sendStatus(200);
};