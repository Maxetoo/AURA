import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Questions from './Questions';
import { Link, Navigate, useLocation, useNavigate, useParams} from 'react-router-dom';
import { useSelector, useDispatch} from 'react-redux';
import {updateReview, addAssessment, getAssessments} from '../../slices/assessmentSlice';
import { Loader } from '../../helpers';

const AssessmentSection = () => {
  const location = useLocation().pathname;
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {id} = useParams() 

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});

  const {
    isError,
    errorMessage,
    isLoading,
    generateAssesssmentError,
    generateAssesssmentLoad,
    generatedAssessments,
    review,
    // currentAssessmentAnalysis
  } = useSelector((store) => store.assessment);

  useEffect(() => {
    if (!hasFetchedOnce && !isLoading && !isError && generatedAssessments?.questions) {
      setHasFetchedOnce(true);
    }
  }, [hasFetchedOnce, isLoading, isError, generatedAssessments?.questions]);

  if (!isLoading && Object.keys(generatedAssessments).length === 0) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const { test, reason, questions = [], _id} = generatedAssessments || {};
  const { question, options } = questions[currentQuestion] || {};

  const handleContinueQuestions = () => {
    const nextQuestion = currentQuestion < questions.length - 1 ? currentQuestion + 1 : currentQuestion;
    setCurrentQuestion(nextQuestion);
  };

  const handlePreviousQuestions = () => {
    const prevQuestion = currentQuestion === 0 ? currentQuestion : currentQuestion - 1;
    setCurrentQuestion(prevQuestion);
  };

const handleOptionSelect = (questionIndex, option) => {
  const updatedOptions = {
    ...selectedOptions,
    [questionIndex]: {
      question: questions[questionIndex]?.question,
      selection: option,
    },
  };

  setSelectedOptions(updatedOptions);

  const answersArray = Object.values(updatedOptions);
  dispatch(updateReview({ answers: answersArray, testCode: test }));
};

const handleSubmit = async () => {
  const answersArray = Object.values(selectedOptions); 
  await dispatch(updateReview({ answers: answersArray, testCode: test }));


  const resultAction = await dispatch(addAssessment({ review, analysisId: id}));

  try {
    const payload = resultAction.payload;
    if (addAssessment.fulfilled.match(resultAction)) {
      if (payload.status === 'success') {
        dispatch(getAssessments({analysisId: 
          id
        }))
        navigate(`/review`);
      }
    }
  } catch (error) {
    console.error('Failed to analyze symptoms:', error);
  }
};

  return (
    <Wrapper>
      {(!hasFetchedOnce || isError) ? (
        <div className="load_section">
          <Loader />
        </div>
      ) : (
        <>
          <div className="secondary_wrapper">
            <div className="assessemnt_desc_container">
              <h3>{test}</h3>
              <p>{reason}</p>
            </div>

            <div className="main_assessment_container">
              <div className="meter_container">
                <div className="meter_details_container">
                  <p>Question {currentQuestion + 1} of {questions.length}</p>
                  <p>{questions.length ? `${Math.round(((currentQuestion + 1) / questions.length) * 100)}% complete` : 'Loading...'}</p>
                </div>
                <div className="progress_bar_container">
                  <div
                    className="bar"
                    style={{
                      width: questions.length
                        ? `${Math.round(((currentQuestion + 1) / questions.length) * 100)}%`
                        : '0%',
                    }}
                  ></div>
                </div>
              </div>

              <Questions
                question={question}
                options={options}
                selectedOption={selectedOptions[currentQuestion]}
                onSelectOption={(option) => handleOptionSelect(currentQuestion, option)}
              />
            </div>
            {
                 generateAssesssmentError && <div className="alert_error_container">
                    <p>{errorMessage}</p>
                </div>
            }
            <div className="btn_container">
              <button type="button" className="ctn-btn prev-btn" onClick={handlePreviousQuestions}>Previous</button>
              {currentQuestion === questions.length - 1 ? (
                <button type="button" className={`ctn-btn ${generateAssesssmentLoad ? 'btn_load' : ''}`} 
                onClick={handleSubmit}>
                  {generateAssesssmentLoad ? 'Submitting' : 'Submit'}
                </button>
              ) : (
                <button type="button" className="ctn-btn" onClick={handleContinueQuestions}>Next</button>
              )}
            </div>
          </div>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 3em;

  .load_section {
    height: 70vh;
    display: grid;
    place-content: center;
  }

  .secondary_wrapper {
    margin-top: 8rem;
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .assessemnt_desc_container {
    width: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #F7F6F5;
    border: solid 0.5px var(--primary-color);
    border-radius: 25px;
    line-height: 25px;
  }

  .assessemnt_desc_container h3 {
    font-weight: 600;
  }

  .main_assessment_container {
    margin-top: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .meter_container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .meter_details_container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    color: #5b5b5b;
  }

  .progress_bar_container {
    margin-top: 1rem;
    height: 10px;
    background: #808080;
    border-radius: 20px;
    overflow: hidden;
  }

  .bar {
    height: 100%;
    background: var(--primary-color);
    transition: 0.1s ease-out;
  }

  .alert_error_container {
    margin-top: 3rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--error-color);

  }

  .btn_container {
    width: 100%;
    margin-top: 3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .ctn-btn {
    height: 55px;
    width: auto;
    padding: 1rem 2.5rem;
    display: grid;
    place-content: center;
    font-size: 1em;
    background: var(--primary-color);
    color: var(--white-color);
    border: none;
    border-radius: 35px;
  }

  .prev-btn {
    background: none;
    border: solid 1px var(--primary-color);
    color: #000;
  }

  .btn_load {
    opacity: 0.7;
  }

  @media only screen and (min-width: 992px) {
    .secondary_wrapper {
      width: 60%;
    }
  }

  @media only screen and (min-width: 1200px) {
    .secondary_wrapper {
      width: 50%;
    }
  }
`;

export default AssessmentSection;
