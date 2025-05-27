import React, {useEffect} from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {howMatchWorksData} from '../data/howMatchWorksData';
import {toggleShowHowMatchWorks} from '../slices/eventSlice'
import {getAssessments} from '../slices/assessmentSlice'
import { FaCaretDown, FaCaretUp} from "react-icons/fa6";
import { useDispatch, useSelector} from 'react-redux';
import {Loader} from '../helpers';



const TherapyPage = () => {
  const dispatch = useDispatch();
  const {showHowMatchWorks} = useSelector((store) => store.event);
  const {userCookie} = useSelector((store) => store.auth);

  const { currentAssessmentAnalysis, 
              getAssessmentLoad,
              currentAssessment
      } = useSelector((store) => store.assessment)
  
      const {assessment, message} = currentAssessment || {}
      useEffect(() => {
          if (currentAssessmentAnalysis) {
              dispatch(getAssessments({analysisId: currentAssessmentAnalysis }))
          }
      }, [dispatch, currentAssessmentAnalysis]);


  return (
    <Wrapper>
        <div className="secondary_wrapper">
            <h3 className='title'>
              Virtual Therapy Sessions
            </h3>
            <p className='desc'>
              Connect with licensed therapists from the comfort of your home. Our matching system helps pair you with professionals who specialize in your specific needs.
            </p>
            <div className="how_match_works_container">
              <div className="content_match_header" onClick={() => dispatch(toggleShowHowMatchWorks())}>
                <h4>
                  <strong>
                    How AI Matching Works
                  </strong>
                  </h4>
                <div className="caret_icon">
                  {showHowMatchWorks ? <FaCaretDown /> : <FaCaretUp/>}
                </div>
              </div>
              {showHowMatchWorks && <div className="match_works_details">
                {
                  howMatchWorksData.map((item) => {
                    return (
                      <div className="match_works_item" key={item.id}>
                        <p>{item.details}</p>
                      </div>
                    )
                  })
                }
              </div>}
            </div>
            {!userCookie ? (
            <>
              <p className="desc">
                <strong>Please login to continue with your matches</strong>
              </p>
              <div className="btn_container">
                <Link to="/login">
                  <button type="button">Login</button>
                </Link>
              </div>
            </>
          ) : getAssessmentLoad || !assessment || Object.keys(assessment).length === 0 ? (
            <div className="load_section">
              <Loader />
            </div>
          ) : assessment?.status === 'in_progress' ? (
            <>
              <p className="desc">
                <strong>{message}</strong>
              </p>
              <div className="btn_container">
                <Link to="/symptomChecker">
                  <button type="button">Complete Assessments</button>
                </Link>
              </div>
            </>
          ) : !assessment?.review || assessment?.review?.length === 0 ? (
            <>
              <p className="desc">
                <strong>
                  You have not completed any assessments yet. Please complete an assessment to find a therapist.
                </strong>
              </p>
              <div className="btn_container">
                <Link to="/symptomChecker">
                  <button type="button">Take Symptom Checker</button>
                </Link>
              </div>
            </>
          ) : assessment?.status === 'in_progress' ? (
            <>
              <p className="desc">
                <strong>
                  {message || 'You have assessments in progress. Please complete them to find a therapist.'}
                </strong>
              </p>
              <div className="btn_container">
                <Link to="/assessment">
                  <button type="button">Complete Assessments</button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="desc">
                <strong>You have completed your matches. Click on the button below to continue</strong>
              </p>
              <div className="btn_container">
                <Link to="/therapy">
                  <button type="button">Match Therapist</button>
                </Link>
                <Link to="/symptomChecker">
                  <button type="button" className="btn_2">Take Another Test</button>
                </Link>
              </div>
            </>
          )}

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


  .how_match_works_container {
    width: 100%;
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .content_match_header {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    user-select: none;
  }

  .match_works_details {
    margin-top: 2rem;
  }

  .caret_icon {
    font-size: 1.5em;
    cursor: pointer;
    color: var(--primary-color);
  }

  .match_works_item {
    margin-bottom: 0.5rem;
  }

  .btn_container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 4rem;
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
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
    }
`
export default TherapyPage