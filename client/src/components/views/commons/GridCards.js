import React from 'react'
import { Col } from 'antd';


function GridCards(props) {
    if (props.landingPage) { //영화정보 카드
        return (
            <Col lg={6} md={8} sm = {12} xs={24}>
                <div style={{ position: 'relative' }}>
                    <a href={`/movie/${props.movieId}`} >
                        <img src={props.image} style={{ width: '100%', height: '320px' }}  alt={props.movieName} />
                    </a>
                </div>
            </Col>
        )
    } else {
        return ( //배우정보 카드
            <Col lg={6} md={8} sm = {12} xs={24}> 
                <div style={{ position: 'relative' }}>
                    <img src={props.image}  style={{ width: '100%', height: '320px' }} alt={props.characterName} />
                </div>
            </Col>
        )
    }

}

export default GridCards
