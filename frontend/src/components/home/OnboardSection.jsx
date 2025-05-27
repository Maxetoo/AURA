import React from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OnboardSection = () => {
  const { userCookie } = useSelector((store) => store.auth);

  return (
    <Wrapper>
        <div className="secondary_wrapper">
        <h3>Begin your Journey Today</h3>
        <p>Take the first step toward understanding and improving your mental wellbeing with our comprehensive assessment tools and professional support.</p>
        {
            userCookie ?
            <Link to={'/symptomChecker'}>
              <button type="button">
                  Start Symptom Checker
              </button>
            </Link>
            : <Link to={'/signup'}>
              <button type='button'>
                  Get Started
              </button>
            </Link>
        }
        </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    margin-top: 3rem;
    width: 100%;
    height: auto;
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

  button {
    margin-top: 2rem;
    height: 55px;
    font-size: 1em;
    width: auto;
    border: none;
    border-radius: 35px;
    background: var(--primary-color);
    color: var(--white-color);
    padding: 1rem 2rem;
  }

  @media only screen and (min-width: 600px) {
    p {
        width: 70%;
    }
  }

  @media only screen and (min-width: 992px) {
    p {
        width: 50%;
    }
  }
`

export default OnboardSection