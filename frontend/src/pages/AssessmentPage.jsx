import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import SingleAssessment from '../components/assessment/SingleAssessment';
import { getAssessments } from '../slices/assessmentSlice';
import { Loader } from '../helpers';
import {Link} from 'react-router-dom';

const AssessmentPage = () => {
  const dispatch = useDispatch();

  const {
    assessments,
    currentAssessment,
    getAssessmentLoad,
  } = useSelector((store) => store.assessment);
  const { user, isLoading } = useSelector((store) => store.user);
  const {userCookie} = useSelector((store) => store.auth);

  const selectedAssessments =
    (!isLoading &&
      user?.recommendedTests?.find(
        (item) => item._id === user?.activeAssessmentId
      )?.assessments) ||
    [];

  const defaultAssessments =
    (!isLoading && user?.recommendedTests?.[0]?.assessments) || [];

  const activeAssessments = assessments?.length > 0 ? assessments : selectedAssessments;

  const defaultAssessmentId = user?.recommendedTests?.[0]?._id;

  const analysisId = user ? user?.activeAssessmentId : defaultAssessmentId;

    useEffect(() => {
    
    if (analysisId && Object.keys(currentAssessment).length === 0) {
      dispatch(getAssessments({ analysisId }));
    }

  }, [dispatch, analysisId, currentAssessment]);


  const { assessment } = currentAssessment || {};

  return (
    <Wrapper>
      <div className="secondary_wrapper">
        <h3 className="title">Recommended Assessments</h3>
        <p className="desc">
          Based on your symptoms, our AI recommends the following assessments. These assessments are designed to help evaluate specific mental health conditions.
        </p>
        <div className="assessment_container">
          {getAssessmentLoad 
          ? (
            <div className="load_section">
              <Loader />
            </div>
          ) : !userCookie ? 
            <>
              <Link to={'/login'}>
                <button type='button'>
                  Login
                </button> 
              </Link>
            </>
            : activeAssessments.length === 0 ? 
            <>
                <p className="desc">
                  <strong>
                  No Assessments Available. Please complete the Symptom Checker to get started.
                  </strong>
                  </p>
                <Link to={'/symptomChecker'}>
                <button type='button'>
                  Symptom Checker
                </button>
              </Link>
            </>
            :
            (
            (activeAssessments.length > 0 ? activeAssessments : defaultAssessments).map(
              (values) => (
                <SingleAssessment
                  {...values}
                  key={values._id}
                  takenTests={(assessment && assessment?.review) || []}
                  analysisId={analysisId}
                />
              )
            )
          )}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: auto;
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
  }

  .assessment_container {
    margin-top: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .load_section {
    margin-top: 5rem;
    padding-bottom: 2rem;
  }

   button {
    margin-top: 3rem;
    background: var(--primary-color);
    color: var(--white-color);
    height: 55px;
    border: none;
    padding: 1rem 3rem;
    font-size: 1em;
    border-radius: 35px;
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
    }
`
export default AssessmentPage