import React, { useEffect, useState } from 'react'
import './favorite.css';
import Axios from 'axios';
import { Popover } from 'antd';
import { IMAGE_BASE_URL  ,POSTER_SIZE} from '../../Config';

function FavoritePage() {

    const [Favorites, setFavorites] = useState([])





    //좋아요 영보 가져오기
    useEffect(() => {
        Axios.post('/api/favorite/getFavoredMovie', { userFrom: localStorage.getItem('userId') })
        .then(response => {
            if (response.data.success) {
                setFavorites(response.data.favorites)
            } else {
                alert('영화 정보를 가져오는데 실패 했습니다.')
            }
        })
       
    }, [])




    //좋아요 목록에서 삭제하기
    const onClickDelete = (movieId, userFrom) => {

        const variables = {
            movieId: movieId,
            userFrom: userFrom
        }

        Axios.post('/api/favorite/removeFromFavorite', variables)
            .then(response => {
                if (response.data.success) {
                
                    Axios.post('/api/favorite/getFavoredMovie', { userFrom: localStorage.getItem('userId') })//다시 좋아요 영보 가져오기 : 화면에 바로 랜더링되게
                    .then(response => {
                        if (response.data.success) {
                            setFavorites(response.data.favorites)
                        } else {
                            alert('영화 정보를 가져오는데 실패 했습니다.')
                        }
                    })


                } else {
                    alert("리스트에서 지우는데 실패했습니다.")
                }
            })
    }


    const renderCards = Favorites.map((favorite, index) => {
        const content = (
            <div>
                {favorite.moviePost ?
            <img src={`${IMAGE_BASE_URL}${POSTER_SIZE}${favorite.moviePost}`} /> : "no image"
                }              
            </div>
        )
        return <tr key={index}> 
            <Popover content={content} title={`${favorite.movieTitle}`} >
            <td><a style={{color:'gray'}}href={`/movie/${favorite.movieId}`} >{favorite.movieTitle}</a></td>
            </Popover>
            <td>{favorite.movieRunTime} mins</td>
            <td><button onClick={() => onClickDelete(favorite.movieId, favorite.userFrom)}>삭제</button></td>
        </tr>
    })

    //popover : 갖다대면 사진띄움
    //content : 이미지 삽입부분

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h2>  영화 목록 </h2>
            <hr />
            <table>
                <thead>
                    <tr>
                        <th>제목</th>
                        <th>상영시간</th>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {renderCards}
                </tbody>
            </table>
        </div>
    )
}

export default FavoritePage
