import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';

function LikeDislikes(props) {
    const user = useSelector(state => state.user)

    const [Likes, setLikes] = useState(0) //좋아요수
    const [Dislikes, setDislikes] = useState(0) //싫어요수
    const [LikeAction, setLikeAction] = useState(null) //좋아요 눌렀는지 여부
    const [DislikeAction, setDislikeAction] = useState(null) //싫어요 눌렀는지 여부
    let variable = {};

    if (props.video) {
        variable = { videoId: props.videoId, userId: props.userId }
    } else {
        variable = { commentId: props.commentId, userId: props.userId }
    }

    

    //좋아요수 불러오기
    useEffect(() => {

        Axios.post('/api/like/getLikes', variable)
            .then(response => {
                console.log('getLikes',response.data)
                if (response.data.success) {             
                    setLikes(response.data.likes.length)
                    //내가 이미 좋아요 눌렀다면
                    response.data.likes.map(like => {
                        if (like.userId === props.userId) {
                            setLikeAction('liked')//좋아요 표시
                        }
                    })
                } else {
                    alert('')
                }
            })

        //싫어요수 불러오기
        Axios.post('/api/like/getDislikes', variable)
            .then(response => {
                console.log('getDislike',response.data)
                if (response.data.success) {               
                    setDislikes(response.data.dislikes.length)
                    //내가 이미 싫어요 눌렀다면 
                    response.data.dislikes.map(dislike => {
                        if (dislike.userId === props.userId) {
                            setDislikeAction('disliked')//싫어요 표시
                        }
                    })
                } else {
                    alert('')
                }
            })
    }, [])


    //좋아요
    const onLike = () => {
        if (user.userData && !user.userData.isAuth) {
            return alert('로그인이 필요합니다');
        }
        //전에 좋아요를 누르지않았다면 좋아요 누르기
        if (LikeAction === null) {
            Axios.post('/api/like/upLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setLikes(Likes + 1) //좋아요수+1
                        setLikeAction('liked')//좋아요 표시;
                        //싫어요를 눌렀던 상태라면
                        if (DislikeAction !== null) {
                            setDislikes(Dislikes - 1) //싫어요수-1
                            setDislikeAction(null) //싫어요 표시 해제
                        }
                    } else {
                        alert('좋아요 실패')
                    }
                })
        } 
        //전에 좋아요를 이미 누른상태라면 좋아요 해제하기
        else {
            Axios.post('/api/like/unLike', variable)
                .then(response => {
                    if (response.data.success) {

                        setLikes(Likes - 1)//좋어요수-1
                        setLikeAction(null)//좋아요 표시 해제

                    } else {
                        alert('좋아요 해제 실패')
                    }
                })
        }
    }

    //싫어요
    const onDisLike = () => {
        if (user.userData && !user.userData.isAuth) {
            return alert('로그인이 필요합니다');
        }
        //전에 싫어요를 이미 누른상태라면 좋아요 해제하기
        if (DislikeAction !== null) {
            Axios.post('/api/like/unDisLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setDislikes(Dislikes - 1)//싫어요수-1
                        setDislikeAction(null)//싫어요 표시 해제
                    } else {
                        alert('싫어요 해제 실패')
                    }
                })

        }
        //전에 싫어요를 누르지않았다면 싫어요 누르기
        else {

            Axios.post('/api/like/upDisLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setDislikes(Dislikes + 1)//싫어요수+1
                        setDislikeAction('disliked')//싫어요 눌렀다고 표시;
                        //싫어요를 눌렀던 상태라면
                        if(LikeAction !== null ) {
                            setLikes(Likes - 1)//좋아요수-1
                            setLikeAction(null)//좋아요 표시 해제
                        }
                    } else {
                        alert('Failed to increase dislike')
                    }
                })


        }


    }
    {/*좋아요 싫어요*/}
    return (
        <React.Fragment>
            <span key="comment-basic-like">
                <Tooltip title="Like"> 
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike} />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Likes}</span>
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon
                        type="dislike"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDisLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Dislikes}</span>
            </span>
        </React.Fragment>
    )
}
//Tooltip : 마우스 hover시 이미지
export default LikeDislikes
