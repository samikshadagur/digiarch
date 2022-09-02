const express= require("express");
const bodyParser= require("body-parser");
const ejs= require("ejs");
const mongoose= require("mongoose");
const bcrypt= require("bcrypt");
const saltRounds=10;

const app= express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/digiarch');

const userSchema= new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    groups:[{groupName:String,groupCode:String}]
});

const User = mongoose('User', userSchema);

app.get("/",function(req,res){
    res.render("home",{msg:""});
  });
  
  app.get("/register",function(req,res){
      res.render("register",{registrationMsg:""});
  });
  
  app.get("/login",function(req,res){
      res.render("login",{loginMsg:""});
  })
  app.get("/design",function(req,res){
    res.render("design",{designMsg:""});
})

  app.post("/register",function(req,res){
    User.findOne({email: req.body.email},function(err,doc){
        if(doc===null){
            if(req.body.pw===req.body.pw-rep){
                bcrypt.hash(req.body.pw, saltRounds, function(err, hash) {
                    var user= new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                      });
                      user.save();
                });                
                res.render("home",{msg:"registration complete!"});
              }else{
                res.render("register",{registrationMsg:"Passwords don't match!"});
              }
        }else{
            res.render("register",{registrationMsg:"Username already exists"});
        }
    });
    
})

app.post("/login",function(req,res){
    User.findOne({email: req.body.email},function(err,doc){
        if(doc != null){
            bcrypt.compare(req.body.pw, doc.pw, function(err, result) {
                result == true;
                if(result===true){
                    res.render("design",{name: doc.name,});
                    userProfile= doc.name;
                }else{
                    res.render("login",{loginMsg: "Incorrect Password!"});
                }
            });
        }else{
            res.render("login",{loginMsg: "Incorrect Username!"});
        }
    });
});


app.listen(3000,function(){
  console.log("Server started at port 3000");
});