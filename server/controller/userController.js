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
  console.log("enetering in to the login------", req.body);

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

     const userData = await Users.findOne({_id:userId})
     console.log(userData,'enterint in to the get');
     res.json({userData})

  } catch (error) {
    console.log('Failed to decode JWT:', error.message);
  }}


  const edit = async(req,res)=>{
    try {
      const data = req.query.user
      const token = data
  
      const decoded = jwt.verify(token, 'secretCode');
      const userId = decoded.id;
  
       const userData = await Users.findOne({_id:userId})
       const success=true;
       console.log("data is comming");
       console.log(userData,'---------suscess is sented--------');
       res.json({userData,success})
    } catch (error) {
      console.log(error.message);
    }
  }
  const editValue=async(req,res)=>{
    try {
      console.log("entering in to value editing ",req.body)
      const data = req.body.user;
      const token = data
      console.log(req.file.filename,'sdkfmdskfmdskomk-----------------------');
      const decoded = jwt.verify(token, 'secretCode');
      const userId = decoded.id;
  
       await Users.findOneAndUpdate({_id:userId},{Name: req.body.name,Email: req.body.email,Password: req.body.password,image: req.file.filename}).then((value)=>{
        console.log(value,'---updataed');
       })
       const success=true;
        res.json({success})
     } catch (error) {
      console.log(error.message);
    }
  }
const home = async (req, res) => {};

module.exports = {
  Register,
  login,
  home,
  profile,
  edit,
  editValue
};
