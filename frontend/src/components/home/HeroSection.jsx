import React from 'react'
import styled from 'styled-components';
import comforting from '../../assets/comforting.jpg';
import { FaArrowRightLong } from "react-icons/fa6";
import {Link} from 'react-router-dom';

const HeroSection = () => {
  return (
    <Wrapper>
        <div className="secondary_wrapper">
            <div className="details_wrapper">
              <h3>
                  Begin Your Mental Health Journey Today
              </h3>
              <p>
              Take industry-standard diagnostic tests, connect with licensed professionals, and get the support you need on your mental health journey.
              </p>
              <div className="btn_container">
                <Link to={'/symptomChecker'}>
                  <button type="button" className='btn_1'>
                  Start Symptom Checker
                </button>
                </Link>
                <Link to={'/therapy'}>
                  <button type="button" className='btn_2'>
                  Find a Therapist
                    <FaArrowRightLong />
                </button>
                </Link>
              </div>
            </div>
            <img src={comforting} alt="" className='illustration'
            lazyLoad="eager"
            />
        </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-top: 10rem;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .secondary_wrapper {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .details_wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h3 {
    font-size: 2.5em;
    text-align: start;
    font-weight: 500;
  }

  p {
    margin-top: 2rem;
    text-align: start;
    font-size: 1em;
    line-height: 25px;
  }

  .btn_container {
    margin-top: 3rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  button {
    width: 100%;
    height: 55px;
    display: grid;
    place-content: center;
    font-size: 1em;
    border: none;
    border-radius: 35px;

  }

  .btn_1 {
    background: var(--primary-color);
    color: var(--white-color);
  }

  .btn_2 {
    background: none;
    border: solid 1px var(--secondary-color);
    color: var(--secondary-color);
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;
  }

  .illustration {
    height: auto;
    width: 100%;
    margin-top: 2rem;
    object-fit: cover;
    font: var(--secondary-color);
  }

@media only screen and (min-width: 600px) {
 
  h3 {
    text-align: center;
    width: 80%;
  }

  p {
    text-align: center;
    width: 80%;
  }
  .btn_container {
    width: 80%;
  }

  .illustration {
    width: 80%;
  }
}

@media only screen and (min-width: 992px) {
  h3 {
    font-size: 3em;
  }

  p {
    font-size: 1.3em;
    line-height: 35px;
  }

  .details_wrapper {
    width: 80%;
  }

  .btn_container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  button {
  width: auto;
  padding: 2rem 3rem;
  height: 60px;
  border-radius: 35px;
  }

  .illustration {
    width: 50%;
  }
}

`
export default HeroSection