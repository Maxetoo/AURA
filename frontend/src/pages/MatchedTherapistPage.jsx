import React from 'react'
import styled from 'styled-components';
import { Link, useLocation, Navigate} from 'react-router-dom';
import { useSelector} from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


const MatchedTherapistPage = () => {

  const location = useLocation();
  const { 
    therapistMatches,
        } = useSelector((store) => store.assessment)
  
    const {therapists} = therapistMatches || {}


    if (!therapists || therapists.length === 0) {
        return <Navigate to='/review' state={{ from: location }} replace />
    }


  return (
    <Wrapper>
        <div className="secondary_wrapper">
            <h3 className='title'>
              Matched Therapist - {therapists.length} Match{therapists.length > 1 ? 'es' : ''} Found
            </h3>
            <p className='desc'>
              Based on your assessments. We have matched you with therapists who specialize in your specific needs. You can view their certifications below and choose the one that best fits your requirements.
            </p>
            <></>
            <div className="match_container">
              <Swiper
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards]}
                className="mySwiper">
                  {
                    therapists.map((therapist) => {
                      const {_id, firstname, lastname, email, certifications, profilePhoto} = therapist || {};
                      return <SwiperSlide key={_id} className='slide'>
                        <div className="slide_content">
                          <img src={profilePhoto} alt="profile"/>

                          <div className="therapist_details">
                            <h3>Dr {lastname} {firstname}</h3>
                            <p>Therapist</p>
                            <p>{email}</p>
                          </div>
                          <div className="btn_container">
                            <button type='button'>
                              Book Session
                            </button>
                            <LinkButton 
                            as="a"
                            href={certifications}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn_2">
                              View Certifications
                            </LinkButton>
                          </div>
                          </div>
                        </SwiperSlide>
                    })
                  }
              </Swiper>

            </div>
        </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 5em;

  .secondary_wrapper {
    margin-top: 8rem;
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .load_section {
    margin-top: 5rem;
    padding-bottom: 2rem;
  }


  .title {
    width: 80%;
    font-size: 1.5em;
    text-align: center;
    font-weight: 600;
  }

  .desc {
    width: 95%;
    margin-top: 2rem;
    text-align: center;
    font-size: 1em;
    line-height: 25px;
  }

  .match_container {
    width: 100%;
    height: auto;
    min-height: 300px;
    background: #f5f5f5;
    border: solid 0.5px var(--stroke-color);
    border-radius: 10px;
    margin-top: 3rem;
    padding: 2.5rem 1.5rem;
  }

    .mySwiper {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }


  .swiper {
    width: 100%;
    height: auto;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
  }

  .slide {
    width: 100%;
    height: 100%;
    padding: 1rem;
  }

  .slide_content {
     width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .match_score {
    font-size: 0.8em;
    color: #808080;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: right;
    padding-bottom: 1rem;
  }

  .slide_content img {
    height: 150px;
    width: 150px;
    border-radius: 50%;
    object-fit: cover;
    object-position: top;
  }

  .therapist_details {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;

    h3 {
      font-size: 1.2em;
      font-weight: 600;
      text-align: center;
    }

    p {
      margin-top: 0.5rem;
    }
  }

  .btn_container {
    margin-top: 3rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  button {
    background: var(--primary-color);
    color: var(--white-color);
    height: 55px;
    border: none;
    width: 80%;
    font-size: 1em;
    border-radius: 35px;
  }


  .btn_2 {
    background: none;
    border: solid 1.5px var(--primary-color);
    color: #000;
  }



  @media only screen and (min-width: 600px) {
        .secondary_wrapper {
          width: 70%;
        }
      }

    @media only screen and (min-width: 992px) {
      .desc {
        width: 70%;
      }
      .secondary_wrapper {
          width: 60%;
        }

      .btn_container {
          width: 60%;
        }
    }
`

const LinkButton = styled(Link)`
  background: none;
  border: solid 1.5px var(--primary-color);
  color: #000;
  height: 55px;
  width: 80%;
  font-size: 1em;
  border-radius: 35px;
  text-align: center;
  line-height: 55px;
  text-decoration: none;
  display: inline-block;

  &:hover {
    opacity: 0.9;
  }
`;

export default MatchedTherapistPage