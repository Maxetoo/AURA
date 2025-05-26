import React from 'react'
import styled  from 'styled-components';
import {Link} from 'react-router-dom';
import {AlertError} from '../helpers';
import { FaArrowRightLong } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux'
import {fillLoginInputs, login, togglePasswordVisibility} from '../slices/authSlice';
import { FaEye, FaEyeSlash} from "react-icons/fa";


const LoginPage = () => {
  const dispatch = useDispatch();
  const {
     loginInputs: {
        email,
        password,
    },
    loginErrorMessage,
    loginLoad,
    loginError,
     isLoginPasswordVisible
  } = useSelector((store) => store.auth);

  

  return (
    <Wrapper>
      <div className="secondary_wrapper">
        <h3>Login</h3>
        <form>
          
          <label htmlFor="Email">
            <input type="email" 
            placeholder='Email'
            value={email}
            onChange={(e) => dispatch(fillLoginInputs({
              email: e.target.value,
              password
            }))}
            />
          </label>
          <label htmlFor="Password" className='password'>
            <input 
            type={`${isLoginPasswordVisible ? 'text' : 'password'}`} 
            placeholder='Password'
            className='password_input'
            value={password}
            onChange={(e) => dispatch(fillLoginInputs({
              password: e.target.value,
              email
            }))}
            />
             <div className="visibility" 
             onClick={() => dispatch(togglePasswordVisibility({type: 'login'}))}
             >
                {isLoginPasswordVisible ? <FaEye/> : <FaEyeSlash/>}
            </div>
          </label>
          <div className="alert_message_container">
            {loginError && <AlertError message={loginErrorMessage}/>}
          </div>
          <button type="button" 
          className={`${loginLoad ? 'btn_load' : ''}`}
          onClick={() => dispatch(login({email, password}))}>
            Submit
            <FaArrowRightLong />
          </button>
          <Link to="/signup">
            <p>Create Account</p>
          </Link>
        </form>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 5em;

  .secondary_wrapper {
    margin-top: 10rem;
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h3 {
    font-size: 1.8em;
    text-align: start;
    font-weight: 600;
  }

  p {
    margin-top: 2rem;
    text-align: start;
    font-size: 1em;
    line-height: 25px;
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
  }

  .alert_message_container {
    margin-top: -2rem;
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

  h4 {
    margin-top: 1rem;
    font-size: 1.3em;
  }

  input {
    background-color: none;
    width: 100%;
    height: 60px;
    border: solid 1.5px var(--stroke-color);
    border-radius: 35px;
    padding: 2rem;
    font-size: 1em;
    outline: none;
  }

  button {
    height: 50px;
    margin-top: 2rem;
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

  @media only screen and (min-width: 600px) {
      form {
      width: 70%;
    }
  }

  @media only screen and (min-width: 768px) {
    form {
    width: 70%;
  }
}


  @media only screen and (min-width: 992px) {
    form {
    width: 50%;
  }
  }

  @media only screen and (min-width: 1200px) {
    form {
    width: 40%;
  }
  }

`
export default LoginPage