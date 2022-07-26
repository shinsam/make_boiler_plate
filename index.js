const express = require('express');
const app = express();


//-----------------------------------------
const mongoose  = require('mongoose');

//--PRIV----------------------------------------
const config = require('./config/key')

//for post-----------------------------------------
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//data model------------------------------------
const {User} =  require('./models/user');


mongoose.connect(config.mongoURI ,{useNewUrlParser: true})
    .then(()=>console.log('DB Connected'))
    .catch(err=>console.err(err));

//middleware로 사용
app.use(bodyParser.urlencoded({extended:true}));// not to get dupplication warning
app.use(bodyParser.json()); //json 사용한다.
app.use(cookieParser()); //모든 요청에 cookireParser 사용한다.

app.get("/", (req,res)=>{
    res.send("Hello hi~~~~~~");
});


app.post('/api/users/register' , (req,res)=>{
    console.log("post req:%s" , req.body );
    
    const user_temp = new User(req.body)

    user_temp.save((err, userData)=>{
        if(err) 
            return res.json({success:false , err})
    })
    return res.status(200).json({
        success:true
    })
})
app.listen(5000);
