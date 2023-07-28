import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from './../helpers/authHelper.js';
import JWT  from "jsonwebtoken";



export const registerController = async(req,res) => {
    try {
        const {name,email,password,phone,address,answer} = req.body
        //VALIDATIONS
        if(!name){
            return res.send({message:'Name is requires'})
        }
        if(!email){
            return res.send({message:'Email is requires'})
        }
        if(!password){
            return res.send({message:'Password is requires'})
        }
        if(!phone){
            return res.send({message:'Phone number is requires'})
        }
        if(!address){
            return res.send({message:'Address is requires'})
        }
        if(!answer){
            return res.send({message:'Answer is requires'})
        }

        //CHECK USER
        const exisitinguser = await userModel.findOne({email})
        //EXISTING USER
        if(exisitinguser){
            return res.status(200).send({
                success:false,
                message:'Already Register please Login',
            })
        }
        //REGISTER USER
        const hashedPassword = await hashPassword(password)
        //SAVE
        const user = await new userModel({name,email,phone,address,password:hashedPassword,answer   }).save()

        res.status(201).send({
            success:true,
            message:'User Register Successfully',
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in registeration',
            error
        })
    }
}

//POST LOGIN 
export const loginController = async(req,res) => {
    try {
        const {email,password} = req.body
        //VALIDATION
        if(!email || !password){
            return res.status(404).send({
                success: false,
                message:'Invaild email or password'
            })
        }
        //CHECK USER
        const user = await userModel.findOne({email})
        //VALIDATION 
        if(!user){
            return res.status(404).send({
                success: false,
                message:'Email is not registerd'
            })
        }
        const match = await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success: false,
                message:'Invalid Password'
            })
        }
        //TOKEN
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET,{expiresIn:'7d'});
        res.status(200).send({
            success:true,
            message:'login successfully',
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role: user.role,
            },
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Login',
            error
        })
    }
};

//FORGOT PASSWORD CONTROLLER
export const forgotPasswordController = async(req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
          res.status(400).send({ message: "Emai is required" });
        }
        if (!answer) {
          res.status(400).send({ message: "answer is required" });
        }
        if (!newPassword) {
          res.status(400).send({ message: "New Password is required" });
        }
        //check
        const user = await userModel.findOne({ email, answer });
        //validation
        if (!user) {
          return res.status(404).send({
            success: false,
            message: "Wrong Email Or Answer",
          });
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
          success: true,
          message: "Password Reset Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
          });
    }
};