const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken')
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
//참조 : https://mongoosejs.com/docs/middleware.html#pre
userSchema.pre('save', function( next){  //mongoose api
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

//https://www.npmjs.com/package/bcrypt
//Schema.prototype.method() 이용 comparePassword 라는 메소드 정의
userSchema.methods.comparePassword = function(plainPassword, cb){
    //아래의 this는 index.js에서 comparePassword를 호출한 findedUser를 말함
    //즉 email정보를 가지고 db에서 얻어온 개체이므로 passwd는 이미 암호화 된 상태임
    //bcrypt의 compare API : compare(data, encrypted, cb)
    console.log("comparePassword22 : " + this.password)
    
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if( err ) return cb(err);
        cb(null, isMatch)
    })
}


userSchema.methods.generateToken  = function(cb){
    var user  = this;
    var token = jsonwebtoken.sign(user._id.toHexString(), 'secret')

    user.token = token;
    user.save(function (err, user){
        if(err )    
            return cb(err)
        cb(null, user)    
    })
}
//왜 statics???
userSchema.statics.findByToken = function(token, cb){
    var user = this;
    jsonwebtoken.verify(token, 'secret', function(err, decode){
        user.findOne({"_id":decode , "token":token}, function(err,user){
            if(err) return cb(err);
            cb(null, user );
        })
    })
}



//위의 스키마를 이용한 모델을 생성한다.
const User = mongoose.model('User' ,userSchema )
console.log("**************************")

//모듈이란 관련된 객체들의 집합소이다.
//exports하면 다른 파일에서 User model을 사용할 수 있다.
//export 말고 exports!!!!!!
module.exports = {User}