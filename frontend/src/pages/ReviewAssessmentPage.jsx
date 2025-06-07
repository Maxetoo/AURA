import React, {useEffect} from 'react'
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import {Link, Navigate} from 'react-router-dom';
import {getAssessments} from '../slices/assessmentSlice';
import {Loader} from '../helpers';

const ReviewAssessmentPage = () => {
    const dispatch = useDispatch();
    // const location = useLocation();


    const {  
            getAssessmentLoad,
            currentAssessment,
    } = useSelector((store) => store.assessment)

    const {userCookie} = useSelector((store) => store.auth);
    

    const {assessment, statusTitle, message} = currentAssessment || {};

    const analysisId = assessment?.analysisId;

    useEffect(() => {
        if (analysisId) {
            dispatch(getAssessments({ analysisId }));
        }
    }, [dispatch, analysisId]);


  return (
    <Wrapper>
        {getAssessmentLoad || (assessment && Object.keys(assessment).length === 0) ? <div className="load_section">
            <Loader/>
        </div>
        :
        <>
            <div className="secondary_wrapper">
            <h3 className='title'>
                {statusTitle}
            </h3>
            <p className='desc'>
                {message}
                {' '}
                <strong>
                     Note: Assessments can only be fully effective after completed examinations
                </strong>
            </p>

            <div className="btn-container">
                {
                    !userCookie ? 
                    <>
                    <Link to={'/login'}>
                        <button type='button'>
                            Login
                        </button>
                    </Link>
                    </>
                    :
                    !assessment ? 
                    <>
                    <Link to={'/assessment'}>
                        <button type='button'>
                            Take Assessment
                        </button>
                    </Link>
                    </>
                    : assessment?.status !== 'in_progress' || !assessment?.status ? 
                    <>
                    <Link to={'/therapy'}>
                        <button type='button'>
                            Match Therapist
                        </button>
                    </Link>
                    <Link to={'/symptomChecker'}>
                        <button type='button' className='btn_2'>
                            Take Another Test
                        </button>
                    </Link>
                    </>
                     : 
                    <Link to={'/assessment'}>
                    <button type='button' 
                        >
                        Finish Assessment
                    </button>
                    </Link>
                }
            </div>
        </div>
        </>}
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
    justify-content: center;

    .load_section {
        display: grid;
        place-content: center;
        height: 100vh;
    }

    .secondary_wrapper {
        width: 90%;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .title {
    font-size: 1.5em;
    text-align: center;
    font-weight: 600;
  }

  .desc {
    margin-top: 2rem;
    text-align: center;
    font-size: 1em;
    line-height: 25px;
    width: 80%;
  }

  .btn-container {
    margin-top: 3rem;
  }

  button {
    background: var(--primary-color);
    color: var(--white-color);
    height: 55px;
    border: none;
    padding: 1rem 3rem;
    font-size: 1em;
    border-radius: 35px;
  }

  .btn_2 {
    margin: 1rem;
    background: none;
    border: solid 1.5px var(--primary-color);
    color: #000;
  }

  @media only screen and (min-width: 600px) {
    .desc {
    width: 55%;
  }
  }

  @media only screen and (min-width: 992px) {
    .desc {
    width: 45%;
  }
  }

`

export default ReviewAssessmentPage