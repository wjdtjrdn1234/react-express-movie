import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col, Button } from 'antd';
import axios from 'axios';
import Comments from './Sections/Comments'
import LikeDislikes from './Sections/LikeDislikes';
import { API_URL, API_KEY, IMAGE_BASE_URL, IMAGE_SIZE } from '../../Config'
import GridCards from '../commons/GridCards';
import MainImage from '../../views/LandingPage/Sections/MainImage';
import MovieInfo from './Sections/MovieInfo';
import Favorite from './Sections/Favorite';


function MovieDetailPage(props) {

    const movieId = props.match.params.movieId //url movieId 가져오기
    const [Movie, setMovie] = useState([]) //해당id 영화 데이터
    const [Casts, setCasts] = useState([]) //해당id 영화 출연진 데이터
    const [CommentLists, setCommentLists] = useState([]) //해당 id 영화 댓글
    const [LoadingForMovie, setLoadingForMovie] = useState(true) //영화로딩여부 :이미지 받기전에 랜더링되는 문제막기위해
    const [LoadingForCasts, setLoadingForCasts] = useState(true) //배우로딩여부  :이미지 받기전에 랜더링되는 문제막기위해
    const [ActorToggle, setActorToggle] = useState(false) //배우이미지 카드 끄고 키고
    const movieVariable = {
        movieId: movieId
    }


    useEffect(() => {
        let endpointForMovieInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`; //id에 해당하는 영화 데이터 가져오기

        fetch(endpointForMovieInfo) //영화 API 불러오기 -> fetch
        .then(result => result.json())
        .then(result => {
            console.log(result)
            setMovie(result) 
            setLoadingForMovie(false)
        })
        .catch(error => console.error('Error:', error)
        )

        let endpointForCasts = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`; //id에 해당하는 출연진 데이터 가져오기
        fetch(endpointForCasts)
            .then(result => result.json())
            .then(result => {
                console.log(result)
                setCasts(result.cast)
                setLoadingForCasts(false)
            })
            .catch(error => console.error('Error:', error)
            )

        

        //댓글 데이터 가져오기
         axios.post('/api/comment/getComments', movieVariable)
            .then(response => {
                console.log(response)
                if (response.data.success) {
                    console.log('response.data.comments', response.data.comments)
                    setCommentLists(response.data.comments)
                } else {
                    alert('Failed to get comments Info')
                }
            })

    }, [])





    //배우이미지 끄고키기
    const toggleActorView = () => {
        setActorToggle(!ActorToggle)
    }



    const updateComment = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }

    //
    return (
        <div>
            {/* 대문사진 */}
            {!LoadingForMovie ? //이미지 받기전에 랜더링되는 문제막기위해
                <MainImage
                    image={`${IMAGE_BASE_URL}${IMAGE_SIZE}${Movie.backdrop_path}`}
                    title={Movie.original_title}
                    overview={Movie.overview}
                />
                :
                <div>loading...</div>
            }


            {/* Body */}
            <div style={{ width: '85%', margin: '1rem auto' }}>

                {/* 영화좋아요 처리 */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Favorite movieInfo={Movie} movieId={movieId} userFrom={localStorage.getItem('userId')} />
                </div> 


                {/* 영화 정보 */}
                {!LoadingForMovie ?
                    <MovieInfo movie={Movie} />
                    :
                    <div>loading...</div>
                }

                <br />
                {/* 배우 정보*/}

                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                    <Button onClick={toggleActorView}>출연진</Button>
                </div>

                {ActorToggle &&
                    <Row gutter={[16, 16]}>
                        {
                            !LoadingForCasts ? Casts.map((cast, index) => (
                                cast.profile_path &&
                                <GridCards
                                    image={cast.profile_path ?
                                    `${IMAGE_BASE_URL}w500${cast.profile_path}` : null}
                                    characterName={cast.name}
                                />)) :
                                <div>loading...</div>
                        }
                    </Row>
                }
                <br />

                {/* 좋아요 싫어요*/}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <LikeDislikes video videoId={movieId} userId={localStorage.getItem('userId')} />
                </div>
                &nbsp;
                {/* 댓글 */}
                <Comments movieTitle={Movie.original_title} CommentLists={CommentLists} postId={movieId} refreshFunction={updateComment} />

            </div>

        </div>
    )
}

export default MovieDetailPage

