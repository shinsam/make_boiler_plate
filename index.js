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
    
    const user = new User(req.body)
    //user.js에서 pre('save')를 이용해서 req로 넘어온 passwd를 encrypt 한다.
    // so, mongoDB에 save되는 것은 암호화된 비번이다.
    user.save((err, doc)=>{
        if(err) 
            return res.json({success:false , err})
        return res.status(200).json({
                success:true,
                userData: doc
            })
        
    })
})
app.listen(5000);
