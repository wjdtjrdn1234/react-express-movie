import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Button } from 'antd';

function Favorite(props) {

    //영화정보는 props로 받아옴
    const movieId = props.movieId //영화 id
    const userFrom = props.userFrom //구독하는 사람
    const movieTitle = props.movieInfo.title //영화 제목
    const moviePost = props.movieInfo.backdrop_path //영화 이미지 경로
    const movieRunTime = props.movieInfo.runtime //영화 상영시간


    const [FavoriteNumber, setFavoriteNumber] = useState(0) //좋아요 수 정보
    const [Favorited, setFavorited] = useState(false) //내가 좋아요 했는지 여부

    let variables = {
        userFrom: userFrom,
        movieId: movieId,
        movieTitle: movieTitle,
        moviePost: moviePost,
        movieRunTime: movieRunTime
    }


    useEffect(() => {
        //좋아요 수 정보
        Axios.post('/api/favorite/favoriteNumber', variables)
            .then(response => {
                if (response.data.success) {
                    setFavoriteNumber(response.data.favoriteNumber)
                } else {
                    alert('숫자 정보를 가져오는데 실패 했습니다.')
                }
            })

        //내가 좋아요 했는지 여부
        Axios.post('/api/favorite/favorited', variables)
            .then(response => {
                if (response.data.success) {
                    setFavorited(response.data.favorited) //구독여부 바꾸기
                } else {
                    alert('정보를 가져오는데 실패 했습니다.')
                }
            })
    }, [])


    //좋아요 누르기
    const onClickFavorite = () => {
        if (Favorited) {//이미 누른상태라면 취소 API
            Axios.post('/api/favorite/removeFromFavorite', variables)
                .then(response => {
                    if (response.data.success) {
                        setFavoriteNumber(FavoriteNumber - 1)
                        setFavorited(!Favorited)
                    } else {
                        alert('Favorite 리스트에서 지우는 걸 실패했습니다.')
                    }
                })
        } else { //좋아요 API 
            Axios.post('/api/favorite/addToFavorite', variables)
                .then(response => {
                    if (response.data.success) {
                        setFavoriteNumber(FavoriteNumber + 1)
                        setFavorited(!Favorited)
                    } else {
                        alert('Favorite 리스트에서 추가하는 걸 실패했습니다.')
                    }
                })
        }
    }



    return (
        <div>
            <Button onClick={onClickFavorite}>{Favorited ? "구독 취소" : "구독"} </Button>
        </div>
    )
}

export default Favorite
