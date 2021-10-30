const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = mongoose.Schema({
    userFrom: {
        type: Schema.Types.ObjectId, //좋아요한 유저
        ref: 'User' //User 정보 모두 불러오기
    },
    movieId: {        //좋아요한 영화 id
        type: String
    },
    movieTitle: {     //좋아요한 영화 제목
        type: String
    },
    moviePost: {     //좋아요한 영화 이미지
        type: String
    },
    movieRunTime: {  //좋아요한 영화 상영 시간
        type: String
    }
}, { timestamps: true })

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = { Favorite }