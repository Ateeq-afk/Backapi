const User = require("../Model/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user){
      // return next(createError(404, "User already Exists !"));
      res.status(200).send({success: false,message:"User already Exists!"});
    }
    else{
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    res.status(200).send({success: true,message:"User has been created!"});
    }
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) 
    { return  res.status(200).send({users: false,message:"User not found!"}) }
    
    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) 
    {
     return res.status(200).send({password: false ,message:"Incorrect password!"});}

    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const { password, ...others } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (err) {
    next(err);
  }
};
const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mudassir@backpackersunited.in",
    pass: "lqrpmmbxgbtujjni"
  }
});
const passwordLink = async (req, res, next) => {
  console.log(req.body)

  const {email} = req.body;

  try {
      const user = await User.findOne({email:email});
      if(!user){
        console.log("no email")
       return res.status(401).json({users:false,message:"Enter Your Email"})
    }
      // token generate for reset password
      const token = jwt.sign({_id:user._id}, process.env.JWT,{
        expiresIn: "300s"
    });
    const setusertoken = await User.findByIdAndUpdate({_id:user._id},{verifytoken:token},{new:true});
          if(setusertoken){
          const mailOptions = {
              from:"mudassir@backpackersunited.in",
              to:email,
              subject:"Sending Email For password Reset",
              html: `<div styke="display:flex; flex-direction:row;">
              <h4 style="color:black;">Hi ${user.name},</h4>
                        <div style="padding-bottom:10px;font-weight:bold;font-size:14px;color:black;"> We have sent you this email in response to your request to reset your password on Backpacker's Partner app. To reset your password, please follow the link below: </div>
                     
                        <div  style="padding-bottom:10px;font-weight:bold;font-size:14px;color:black;">This Link is Valid For 5 MINUTES
                        <a href="http://localhost:3000/forgotpassword/${user.id}/${setusertoken.verifytoken}">Change password</a></div>
            
                        <div style="padding-bottom:10px;font-weight:bold;font-size:14px;color:black;">We recommend that you keep your password secure and not share it with anyone. <div />
             
                        <div style="padding-bottom:10px;font-weight:bold;font-size:14px;color:black;" >If you need help, or you have any other questions, feel free to contact us.<div />
                     
                        <div style="padding-top:30px;font-weight:bold;font-size:14px;color:black;"> Regards,<div />
          
                        <div style="color:black;">Backpackers United </div>
              </ div>`
          }
        

          transporter.sendMail(mailOptions,(error,info)=>{
              if(error){
                  console.log("error",error);
                  res.status(401).json({message:"email not send"})
              }else{
                  console.log("Email sent",info.response);
                  res.status(201).json({message:"Email sent Succsfully"})
              }
          })

        }

  } catch (error) {
      res.status(401).json({message:"invalid user"})
  }

};

const forgotPassword = async (req, res, next) => {
  const {id,token} = req.params;
  const {password} = req.body;
  try {
    const validuser = await User.findOne({_id:id});
      // const validuser = await User.findOne({_id:id,verifytoken:token});
      // console.log(validuser)
      const verifyToken = jwt.verify(token,process.env.JWT);

      if(validuser && verifyToken){
        // if(validuser){
          // const newpassword = await bcrypt.hash(password,12);
          const salt = bcrypt.genSaltSync(10);
          const newpassword = bcrypt.hashSync(password, salt);
          console.log(newpassword)
          const setnewuserpass = await User.findByIdAndUpdate({_id:id},{password:newpassword});

          setnewuserpass.save();
          res.status(201).json({password:true,setnewuserpass})

      }else{
        console.log("user not exist")
          res.status(401).json({message:"user not exist"})
      }
  } catch (error) {
    console.log("error")
      res.status(401).json({status:401,error})
  }
}

module.exports = { signup, signin, googleAuth, passwordLink, forgotPassword };
  
 