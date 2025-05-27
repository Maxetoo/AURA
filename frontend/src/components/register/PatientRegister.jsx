import React from 'react'
import styled from 'styled-components';
import { FaArrowRightLong } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux'
import {togglePasswordVisibility, fillSignupInputs, signup} from '../../slices/authSlice';
import {AlertError} from '../../helpers';
import { FaEye, FaEyeSlash} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Loader} from '../../helpers';



const PatientRegister = () => {
  const dispatch = useDispatch();
  const {
    signupInputs: {
        firstname,
        lastname,
        email,
        password,
        dateOfBirth,
        role = 'Patient',
    },
    isSignupPasswordVisiblePatient,
    signupErrorMessage,
    signupLoad,
    signupError,
  } = useSelector((store) => store.auth);


  return (
    <Wrapper>
      <h3>Patient Register</h3>
      <form>
        <label htmlFor="Firstname">
          <input type="text" 
          placeholder='Firstname'
          value={firstname}
          onChange={(e) => dispatch(fillSignupInputs({
            firstname: e.target.value,
            lastname,
            email,
            password,
            dateOfBirth,
            role
          }))}
          />
        </label>
        <label htmlFor="Lastname">
          <input type="text" 
          placeholder='Lastname'
          value={lastname}
          onChange={(e) => dispatch(fillSignupInputs({
            lastname: e.target.value,
            firstname,
            email,
            password,
            dateOfBirth,
            role
          }))}
          />
        </label>
        <label htmlFor="Email">
          <input type="email" 
          placeholder='Email'
          value={email}
          onChange={(e) => dispatch(fillSignupInputs({
            email: e.target.value,
            lastname,
            firstname,
            password,
            dateOfBirth,
            role
          }))}
          />
        </label>
        <label htmlFor="Password" className='password'>
            <input 
            type={`${isSignupPasswordVisiblePatient ? 'text' : 'password'}`}
            placeholder='Password'
            className='password_input'
            value={password}
            onChange={(e) => dispatch(fillSignupInputs({
              password: e.target.value,
              lastname,
              email,
              firstname,
              dateOfBirth,
              role
            }))}
            />
             <div className="visibility" 
                onClick={() => dispatch(togglePasswordVisibility({type: 'signupPatient'}))}
                  >
                  {isSignupPasswordVisiblePatient ? <FaEye/> : <FaEyeSlash/>}
              </div>
        </label>
         <label htmlFor="Dateofbirth">
            <DatePicker
              className='date_input'
              selected={dateOfBirth ? new Date(dateOfBirth) : null}
              onChange={(date) =>
                dispatch(fillSignupInputs({
                  dateOfBirth: date.toISOString().split('T')[0],
                  firstname,
                  lastname,
                  email,
                  password,
                  role,
                }))
              }
              placeholderText="Date of birth"
              dateFormat="yyyy-MM-dd"
            />

        </label>

        <div className="alert_message_container">
            {signupError && <AlertError message={signupErrorMessage}/>}
        </div>
      
        <button type="button"  
        className={`${signupLoad ? 'btn_load' : ''}`} 
        onClick={() => dispatch(signup({firstname,
        lastname,
        email,
        password,
        dateOfBirth,
        role: "patient"
        }))}>
          Submit
          <FaArrowRightLong />
        </button>
      </form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;

   h3 {
    font-size: 1.5em;
    text-align: start;
    font-weight: 600;
    }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3rem;
    width: 100%;
  }

  label {
    width: 100%;
    margin-bottom: 1.5rem;

    >* {
      width: 100%;
    }

  }

  h4 {
    margin-top: 1rem;
    font-size: 1.3em;
  }

  input {
    width: 100%;
    height: 60px;
    border: solid 1.5px var(--stroke-color);
    border-radius: 35px;
    padding: 2rem;
    font-size: 1em;
    outline: none;
  }

  .date_input {
    height: 60px;
    border: solid 1.5px var(--stroke-color);
  }


  input[type="date"] {
  appearance: none;
  -webkit-appearance: none;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  font-size: 1em;
  height: 60px;
  border-radius: 35px;
  border: solid 1.5px var(--stroke-color);
  outline: none;
  background-color: white;
  color: black;
}


  .password {
    position: relative;
  }

  .visibility {
    position: absolute;
    left: 89%;
    top: 30%;
    font-size: 1.5em;
    color: #808080;
    cursor: pointer;
  }

  .password_input {
    padding-right: 6rem;
  }

   .alert_message_container {
    margin-top: -2rem;
  }



  button {
    height: 50px;
    margin-top: 3rem;
    background: var(--primary-color);
    color: var(--white-color);
    padding: 1rem 3rem;
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

`
export default PatientRegister