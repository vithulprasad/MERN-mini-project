const Users = require("../model/user");
const jwt = require("jsonwebtoken");

const Register = async (req, res) => {
  const Email = req.body.formValues.email;
  const Name = req.body.formValues.username;
  const password = req.body.formValues.password;
  console.log(Email, Name, password);
  const users = await Users.findOne({ Email: Email });

  if (!users) {
    console.log("going to user savw");
    const user = new Users({
      Name: Name,
      Email: Email,
      Password: password,
    });
    await user.save();
    return res.json({
      data: "successRegistration",
    });
  } else {
    if (users.isBlocked == true) {
      console.log("user is already existing ---");
      return res.json({
        data: "userExists",
      });
    } else {
      console.log("user is blocked----");
      return res.json({
        data: "userIsBlocked",
      });
    }
  }
};

const login = async (req, res) => {
  const Email = req.body.formValues.email;
  const password = req.body.formValues.password;
  const findUser = await Users.findOne({ Email: Email });
  if (!findUser) {
    res.json({
      data: "noUser",
    });
  } else {
    if(findUser.Email==Email && findUser.Password==password){
        if (findUser.isBlocked == true) {
            const token = jwt.sign({ id: findUser._id }, "secretCode", {
              expiresIn: "30d",
            });
            const obj = {
              token,
              name: findUser.Name,
              id: findUser._id,
            };
      
            res.send({ findUser, obj, data: "userFinded" });
          } else {
            res.json({ data: "userIsBlocked" });
          }
    }else{
        res.json({ data: "wrong-email-or-password" });
    }

  }
};

const profile = async(req,res)=>{
  try {
    const data = req.query.data
    const token = data

    const decoded = jwt.verify(token, 'secretCode');
    const userId = decoded.id;
    if(userId){
      const userData = await Users.findOne({_id:userId})
      res.json({userData})
    }else{
      res.json({status :false})
    }

    

  } catch (error) {
    console.log('Failed to decode JWT:', error.message);
  }}


  const edit = async(req,res)=>{
    try {
      const data = req.query.user

      const token = data
      const decoded = jwt.verify(token, 'secretCode');
      const userId = decoded.id;


            if(userId){
              const userData = await Users.findOne({_id:userId})
              const success=true;
              console.log("data is comming");
              res.json({userData,success})
            }else{
              res.json({status:false})
            }
    
    } catch (error) {
      console.log(error.message);
    }
  }

  
  const editValue=async(req,res)=>{
    try {
      const data = req.body.user;
     console.log(req.body);
      const token = data
      const decoded = jwt.verify(token, 'secretCode');
      const userId = decoded.id;
      
          if(userId){
            let image; 
            if(!req.file){
            const value= await Users.findOne({_id:userId})
            image=value.image;
            }else{
                image =  req.file.filename;
            }
            await Users.findOneAndUpdate(
              { _id: userId },
              {
                Name: req.body.name,
                Email: req.body.email,
                image: image
              }
            ).then((value)=>{
              console.log("value was updated successfully");
            })
            const success=true;
              res.json({success})
          }else{
            res.json({status:false})
          }
     } catch (error) {
      console.log(error.message);
    }
  }
const home = async (req, res) => {};

const editPassword =async(req,res)=>{
  const code = req.body.user;
  console.log(req.body);
  const verify = jwt.verify(code,"secretCode")
  const is_user = verify.id;

  if(is_user){
      const userData = await Users.findOne({_id:is_user})
      if(userData.Password==req.body.currentPassword){
        await Users.findOneAndUpdate({_id:is_user},{$set:{Password:req.body.newPassword}}).then((value)=>{
          console.log(value);
        })
        .catch((err)=>{
          console.log(err);
        })
       res.json({status:true})
      }else{
        console.log("password is not current ");
        res.json({status:false})
      }
  }
}

module.exports = {
  Register,
  login,
  home,
  profile,
  edit,
  editValue,
  editPassword
};
