const { json } = require("express");
const Admin = require("../model/admin");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

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
    console.log(data,'daffadsf---------------');
    if (!data) {
        console.log("data was not found");
      const message = "admin password or email is wrong";
      res.json({ message });
    } else {
        console.log("data was found");
      const token = jwt.sign({ id: data._id }, "secretCode", {
        expiresIn: "30d",
      });
      const obj = {
        token,
        Email: data.Email,
        id: data._id,
      };
      console.log('value passed to client------');
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
        console.log(user);
        res.json({user})
      }
    } catch (error) {
        console.log(error);
    }
}


exports.blokeUser=async(req,res)=>{
    try {
        console.log("enterd------",req.query);
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
    } catch (error) {
        console.log(error);
    }
}
exports.spelingFind=async(req,res)=>{
    try {
       console.log(req.query); 
       const query = { Name: { $regex: new RegExp(req.query.data, 'i') } };
       const user = await User.find(query)
   console.log(user,'--------------------filterdd data--------------------');
       res.json({user})
    } catch (error) {
        console.log(error.message);
    }
}