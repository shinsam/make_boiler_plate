const mongoose = require('mongoose');
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
//위의 스키마를 이용한 모델을 생성한다.
const User = mongoose.model('User' ,userSchema )

//모듈이란 관련된 객체들의 집합소이다.
//exports하면 다른 파일에서 User model을 사용할 수 있다.
//export 말고 exports!!!!!!
module.exports = {User}