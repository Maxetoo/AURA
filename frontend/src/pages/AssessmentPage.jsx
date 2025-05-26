import React, {useEffect} from 'react'
import styled from 'styled-components';
import {Link, Navigate, useLocation} from 'react-router-dom';
// import {useNavigate} from 'react-router-dom';
import SingleAssessment from '../components/assessment/SingleAssessment';
import {getAssessments} from '../slices/assessmentSlice';
import { useSelector, useDispatch} from 'react-redux'
import {Loader} from '../helpers';

 


const AssessmentPage = () => {
   const dispatch = useDispatch()
   const {assessments, currentAssessmentAnalysis, currentAssessment, getAssessmentLoad } = useSelector((store) => store.assessment)
    const {user, isLoading} = useSelector((store) => store.user)
   const location = useLocation();

   const selectedAssessments = !isLoading && user?.recommendedTests?.find((item) => item._id === currentAssessmentAnalysis)?.assessments || []
  
   
    const activeAssessments = assessments?.length > 0 ? assessments : selectedAssessments

  useEffect(() => {
          if (currentAssessmentAnalysis) {
              dispatch(getAssessments({analysisId: currentAssessmentAnalysis }))
          }
  }, [dispatch, currentAssessmentAnalysis]);

  const {assessment} = currentAssessment || {}

  

  if (!currentAssessmentAnalysis && activeAssessments.length === 0) {
    return <Navigate to="/" state={{ from: location }} replace />
  }
      
  return (
    <Wrapper>
      <>
      <div className="secondary_wrapper">
          <h3 className="title">Recommended Assessments</h3>
          <p className="desc">
            Based on your symptoms, our AI recommends the following assessments. These assessments are designed to help evaluate specific mental health conditions.
          </p>
          <div className="assessment_container">
              {
                (getAssessmentLoad && assessment?.review?.length === 0) ||activeAssessments.length === 0 ? <div className="load_section">
                  <Loader/>
                </div> :
                activeAssessments.map((values, index) => {
                  return <SingleAssessment 
                  {...values} 
                  key={values._id}
                  takenTests={assessment?.review?.[index]}
                  analysisId={currentAssessmentAnalysis}
                  />
                })
              }
          </div>
        </div>
      </>
    </Wrapper>
  )
}

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