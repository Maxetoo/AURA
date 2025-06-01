import React from 'react'
import styled from 'styled-components';
import { useNavigate} from 'react-router-dom';
import {generateQuestions} from '../../slices/assessmentSlice';
import { useDispatch, useSelector } from 'react-redux';


const SingleAssessment = ({test, reason, takenTests}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const {
        isLoading,
        selectedAssessment
    } = useSelector((store) => store.assessment)

  const handleGenerateQuestions = async (code) => {
      const resultAction = await dispatch(generateQuestions({test, reason}));
  
      try {
          const payload = resultAction.payload;
         if (generateQuestions.fulfilled.match(resultAction)) {
          if (payload.status === 'success') {
              navigate(`${code ? `/assessment` : `/assessment/${payload.response?.assessment?._id}`}`)
          }
          
        }
      } catch (error) {
        console.error('Failed analyse symptoms:', error);
      }
    }
    
    const findTakenTest = takenTests?.find((item) => item.testCode === test);



  return (
    <Wrapper>
        <h4>{test}</h4>
        <p>{reason}</p>
        <button type='button' 
        disabled={findTakenTest?.testCode === test}
        onClick={() => handleGenerateQuestions(takenTests?.testCode)}
        
        style={{opacity: `${findTakenTest?.testCode === test ? '0.7' : '1'}`}}
        >{isLoading && selectedAssessment === test ? 'Loading...' : findTakenTest?.testCode === test ? 'Assessment Taken' : 'Take Assessment'}</button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    margin-top: 1.5rem;
    width: 100%;
    height: auto;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    background: #F7F6F5;
    border-radius: 35px;


    h4 {
      font-size: 1.5em;
      text-align: center;
      font-weight: 600;
    }

    p {
      text-align: center;
      line-height: 25px;
    }

    button {
      height: 55px;
      width: auto;
      padding: 1rem 3rem;
      font-size: 1em;
      border: none;
      background: var(--primary-color);
      color: var(--white-color);
      border-radius: 35px;
    }

    .btn_load {
      opacity: 0.6;
    }
    
`
export default SingleAssessment