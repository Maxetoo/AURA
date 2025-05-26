import React from 'react'
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import { FaArrowRightLong } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux'
import {runAnalysis, fillSymptomInput} from '../../slices/assessmentSlice';
import {AlertError} from '../../helpers';

const MainSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isError, errorMessage, symptoms} = useSelector((store) => store.assessment)

  const handleAnalysis = async () => {
    const resultAction = await dispatch(runAnalysis({symptoms}));

    try {
        const payload = resultAction.payload;
       if (runAnalysis.fulfilled.match(resultAction)) {
        if (payload.status === 'success') {
        navigate('/assessment');
        }
        
      }
    } catch (error) {
      console.error('Failed analyse symptoms:', error);
    }
  }

  return (
    <Wrapper>
        <div className="secondary_wrapper">
            <h3>AI Symptom Checker</h3>
            <p>
            Describe your symptoms and our AI will recommend the most appropriate diagnostic assessments for your situation. This is the first step in your mental health assessment journey (Please be as detailed as possible about what you're experiencing. Include information about duration, severity, and impact on your daily life).
            </p>

            <form>
                <textarea 
                placeholder='I have been feeling overwhelmed...'
                value={symptoms}
                className={`${isError ? 'input_error_indicator' : ''}`}
                onChange={(e) => dispatch(fillSymptomInput(e.target.value))}
                />

                {isError && <div className="alert_message_container">
                    <p>
                      {errorMessage}
                    </p>
                </div>}

                <button type="button" 
                  className={`${isLoading ? 'btn_load' : ''}`}
                onClick={handleAnalysis}>
                    Analyze Symptoms
                    < FaArrowRightLong />
                </button>
            </form>
        </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-top: 10rem;
  width: 100%;
  height: auto;
  /* min-height: 100vh; */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 5em;

  .secondary_wrapper {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h3 {
    font-size: 2em;
    text-align: center;
    font-weight: 600;
  }

  p {
    margin-top: 2rem;
    text-align: center;
    font-size: 1em;
    line-height: 25px;
  }

  form {
    width: 100%;
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  textarea {
    min-width: 100%;
    max-width: 100%;
    min-height: 200px;
    border-radius: 35px;
    line-height: 25px;
    border: solid 1px var(--primary-color);
    padding: 2rem;
    font-size: 1em;
    outline: solid 1px var(--primary-color);
  }

  
.input_error_indicator {
    border: none;
    border: solid 1px var(--error-color);
    animation: shake 0.2s;
}

@keyframes shake {
    0% {
        transform: translateX(0);
    }
    10% {
        transform: translateX(-10px);
    }
    20% {
        transform: translateX(10px);
    }
    30% {
        transform: translateX(-10px);
    }
    40% {
        transform: translateX(10px);
    }
    50% {
        transform: translateX(-10px);
    }
    60% {
        transform: translateX(10px);
    }
    70% {
        transform: translateX(-10px);
    }
    80% {
        transform: translateX(10px);
    }
    90% {
        transform: translateX(-10px);
    }
    100% {
        transform: translateX(0);
    }
}


  .alert_message_container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--error-color);
  }

  button {
    height: 55px;
    margin-top: 2rem;
    background: var(--primary-color);
    color: var(--white-color);
    width: auto;
    padding: 2rem 3rem;
    height: 60px;
    border: none;
    border-radius: 35px;
    font-size: 1em;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .btn_load {
    opacity: 0.8;
  }

  @media only screen and (min-width: 600px) {
    p {
        width: 85%;
    }

    textarea {
        min-width: 85%;
        max-width: 85%;
    }

    .alert_message_container {
    width: 50%;
    }
  }

  @media only screen and (min-width: 992px) {
    p {
        width: 65%;
    }

    textarea {
        min-width: 65%;
        max-width: 65%;
    }
  }
`
export default MainSection