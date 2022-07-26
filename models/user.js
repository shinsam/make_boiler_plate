const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50
    },
    email: {
        type:String,
        trim:true,
        unique: 1 
    },
    password: {
        type: String,
        minglength: 5
    },
    lastname: {
        type:String,
        maxlength: 50
    },
    role : {
        type:Number,
        default: 0 
    },
    image: String,
    token : {
        type: String,
    },
    tokenExp :{
        type: Number
    }
})

//pre('save') : save 작업 하기 전에
//save 작업은 index.js 의 post 작업에서 진행한다.
userSchema.pre('save', function( next){
    var user = this;  //this 는 userSchema를 의미함

    if(user.isModified('password')){ //passwd 수정되었을때만
        bcrypt.genSalt(saltRounds, function(err, salt){
            console.log("in genSalt!!!!!!!!!!!!")

            if(err) {
               
                return next(err); //next : do anything down below...???
            }
            
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) {
                    console.log("hash err")
                    return next(err);
                }
                console.log(hash)
                user.password = hash
                next()
            })
        })
    }else{
        next()
    }
});



//위의 스키마를 이용한 모델을 생성한다.
const User = mongoose.model('User' ,userSchema )
console.log("**************************")

//모듈이란 관련된 객체들의 집합소이다.
//exports하면 다른 파일에서 User model을 사용할 수 있다.
//export 말고 exports!!!!!!
module.exports = {User}