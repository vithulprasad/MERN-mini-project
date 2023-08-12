const { json } = require("express");
const Admin = require("../model/admin");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const user = require("../model/user");

exports.login = async (req, res) => {
  const email = req.body.Email;
  const password = parseInt(req.body.Password);
  const One = await Admin.find();

  if (One.length == 0) {
    const value = new Admin({
      Email: email,
      Password: password,
    });
    value.save();
  } else {
    const data = await Admin.findOne({ Password: password, Email: email });
    if (!data) {
      const message = "admin password or email is wrong";
      res.json({ message });
    } else {
      const token = jwt.sign({ id: data._id }, "secretCode", {
        expiresIn: "30d",
      });
      const obj = {
        token,
        Email: data.Email,
        id: data._id,
      };

      const message = "success";
      res.json({ message, obj });
    }
  }
};

exports.getUser=async(req,res)=>{
    try {
      const data = req.query.data;

      const token = data
      const decoded = jwt.verify(token, 'secretCode');
      const userId = decoded.id;

      if(userId){
        const user =  await User.find()
        res.json({user})
      }
    } catch (error) {
        console.log(error);
    }
}


exports.blokeUser=async(req,res)=>{
    try {
         
  //  validating admin is there 
        let token = req.query.token;
        const decoded = jwt.verify(token, 'secretCode');
        const admin = decoded.id;
      
        if (admin){
          const block = await User.findOne({_id:req.query.data})
          const user = await User.find()
          if(block.isBlocked===true){
              console.log('false');
             await User.findOneAndUpdate({_id:req.query.data},{isBlocked:false})
          }else{
               await User.findOneAndUpdate({_id:req.query.data},{isBlocked:true})
               console.log('true');
          }  
          res.json({user})
        }else{
          res.json({status :false});
        }
     
    } catch (error) {
        console.log(error);
    }
}
exports.spelingFind=async(req,res)=>{
    try {
      //  validating admin is there 
      let token = req.query.token;
      const decoded = jwt.verify(token, 'secretCode');
      const admin = decoded.id;


       if(admin){
        const query = { Name: { $regex: new RegExp(req.query.data, 'i') } };
        const user = await User.find(query);
        res.json({user})
       }else{
            res.json({status:false})
       }
      
    } catch (error) {
        console.log(error.message);
    }
}
exports.getUserdetails = async(req,res)=>{

try {
const token = req.query.token;
const verify = jwt.verify(token,'secretCode')

if(verify.id){
    const data = await User.findOne({_id:req.query.data})
    res.json({data})
}
} catch (error) {
console.log(error.message);
}
}


exports.edituser=async(req,res)=>{


  try {
    const token = req.body.data;
    const verify = jwt.verify(token,"secretCode");
    const admin = verify.id
    console.log(admin);

    if (admin){
       await user.findOneAndUpdate({_id:req.body.id},{$set:{Name:req.body.name,Email:req.body.email}})
       console.log("everything updated");
       res.json({status :true})
    }else{
      res.json({status:false})
    }
  } catch (error) {
    console.log(error.message);
  }

}

exports.deleteUser = async(req,res)=>{
  try {
    const token  =req.query.token;
    const id = req.query.data;

    const verify = jwt.verify(token,"secretCode");
    const admin = verify.id;

    if(admin){
        await user.findOneAndDelete({_id:id})
        res.json({status:true})
    }

    console.log(token,id);
  } catch (error) {
    console.log(error.message);
  }
}