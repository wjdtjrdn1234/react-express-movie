import React, { useEffect, useState , useRef } from 'react'
import { FaCode } from "react-icons/fa";
import { API_URL, API_KEY, IMAGE_BASE_URL , IMAGE_SIZE ,POSTER_SIZE} from '../../Config';
import MainImage from './Sections/MainImage';
import axios from 'axios';
import GridCards from '../commons/GridCards';
import { Row } from 'antd';
import { useInView } from "react-intersection-observer" //infinite scroll 

function LandingPage() {


    const [Movies, setMovies] = useState([]) //api호출 통해 가져온 영화들 
    const [MainMovieImage, setMainMovieImage] = useState(null) //대문영화 사진
    const [CurrentPage, setCurrentPage] = useState(0) //현재 페이지
    const [ref, inView] = useInView() //ref 에 걸어둔 div박스가 보이면 inview는 true로 됨 : infinite scroll 


    //처음 로드시 1페이지만 가져오기
    useEffect(() => {
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`; 
        fetchMovies(endpoint)

    }, [])

    //영화 정보 더 불러오기 : infinite scroll 구현
    useEffect(() => {
        if (inView) {
            const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;
            fetchMovies(endpoint)
        }
    }, [inView])


    //영화 불러오기 API
    const fetchMovies = (endpoint) => {
        fetch(endpoint)
            .then(response => response.json()) //fetch : json 변환
            .then(response => {
                console.log(response)
                setMovies([...Movies, ...response.results])
                setMainMovieImage(response.results[0])
                setCurrentPage(response.page)
            })
    }





    return (
        <div style={{ width: '100%', margin: '0' }}>
            {/* 대문사진 */}
            {MainMovieImage &&
                <MainImage
                    image={`${IMAGE_BASE_URL}${IMAGE_SIZE}${MainMovieImage.backdrop_path}`} //backdrop_path 같은정보는 전부 console로 찍어보고 가져옴   
                    title={MainMovieImage.original_title}
                    overview={MainMovieImage.overview}
                />
            }

             {/* 영화목록, gutter: 트랙사이의 간격 */}
            <div style={{ width: '85%', margin: '1rem auto' }}>
                <hr />
                <Row gutter={[16, 16]} > 
                    {Movies && Movies.map((movie, index) => ( 
                         <React.Fragment key={index}>
                            <GridCards //그리드 카드형식으로 영화보여주기 (col,row)
                                landingPage
                                image={movie.poster_path ? //console로 정보확인후 대입
                                    `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}` : null}
                                movieId={movie.id}
                                movieName={movie.original_title}
                            />
                        </React.Fragment> //React Fragment는 div박스라고 생각하면됨
                    ))}
                </Row> 
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
             <div ref={ref}></div> {/* ref 에 걸어둔 div박스가 보이면 inview는 true로 됨 : infinite scroll */}
            </div> 
        </div>
    )
}

export default LandingPage
