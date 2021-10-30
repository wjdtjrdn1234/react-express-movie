const express = require('express');
const router = express.Router();
const  {Favorite}  = require('../models/Favorite');


//좋아요 수
router.post('/favoriteNumber', (req, res) => {

    //DB에서   favorite 숫자를 가져오기 
    Favorite.find({ "movieId": req.body.movieId },
        (err, result) => {
            if (err) return res.status(400).send(err)
            // 그다음에   프론트에  다시   숫자 정보를 보내주기  
            res.status(200).send({ success: true, favoriteNumber: result.length }) //result에는 배열로 정보를 넘겨줄거임 [1,2,3] 이런식
        })

})


//좋아요 여부
router.post('/favorited', (req, res) => {

    // 내가 좋아요를 이미 했는지 정보를 DB에서 가져오기
    Favorite.find({ "movieId": req.body.movieId, "userFrom": req.body.userFrom } //로그인한 아이디가 영화를 좋아요 했는지 여부
        ,(err, info) => {
            if (err) return res.status(400).send(err)
    
            let result = false;
            if (info.length !== 0) { //이미 좋아요 누름
                result = true 
            }

            res.status(200).json({ success: true, favorited: result })//클라이언트에 좋아요 유무 보내주기
        })
})




//디테일 페이지에서 좋아요 

router.post('/addToFavorite', (req, res) => {

    const favorite = new Favorite(req.body) //variable 모든정보 저장

    favorite.save((err, result) => {
        if (err) return res.status(400).send(err)
        return res.status(200).json({ success: true })
    })

})


//디테일 페이지에서 좋아요 취소

router.post('/removeFromFavorite', (req, res) => {

    Favorite.findOneAndDelete({ movieId: req.body.movieId, userFrom: req.body.userFrom }
        ,(err, result) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, result })
        })

})





//좋아요 페이지에서 좋아요영화목록 가져오기
router.post('/getFavoredMovie', (req, res) => {

    Favorite.find({ 'userFrom': req.body.userFrom },
        (err, favorites) => {
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, favorites ,favoriteNumber: favorites.length  })
        })

})

//좋아요 페이지에서 영화삭제
router.post('/removeFromFavorite', (req, res) => {

    Favorite.findOneAndDelete({ movieId: req.body.movieId, userFrom: req.body.userFrom },
        (err, result) => {
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true })
        })

})



module.exports = router;
