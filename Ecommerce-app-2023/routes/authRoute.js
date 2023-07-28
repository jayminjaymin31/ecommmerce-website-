import express from "express";
import {registerController, loginController, forgotPasswordController} from '../controller/authController.js'
import {isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//ROUTER OBJECT
const router = express.Router()

//ROUTING

//REGISTER || METHOD POST 
router.post('/register',registerController);
//LOGIN
router.post('/login',loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);


//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
  });

  //protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
  
export default router