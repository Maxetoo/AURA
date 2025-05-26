import React, {useState } from 'react'
import styled  from 'styled-components';
import {PatientRegister, DoctorRegister} from '../components/register';
import {resetSignupInputs} from '../slices/authSlice';
import {useDispatch} from 'react-redux';

const data = ["Patient", "Therapist"]  

const RegisterPage = () => {
  const dispatch = useDispatch()
  const [activeComponent, setActiveComponent] = useState("Patient")

  const NavComponents = {
    Patient: <PatientRegister />,
    Therapist: <DoctorRegister />,
  }


  const handleComponentChange = (component) => {
    dispatch(resetSignupInputs())
    setActiveComponent(component)
  }

  
  return (
    <Wrapper>
      <div className="secondary_wrapper">
        <div className="nav_container">
          {
            data.map((item, index) => {
              return <div 
              className={`nav ${activeComponent === item ? 'active_nav' : ''}`}
              key={index}
              onClick={() => handleComponentChange(item)}
              >{item}</div>
            })
          }
        </div>
        <div className="component_container">
          {NavComponents[activeComponent]}
        </div>
      </div>
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

  .nav_container {
    background: #F7F6F5;
    width: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    cursor: pointer;
    border-radius: 35px;
  }

  .nav {
    padding: 1.5rem 2rem;
    height: 100%;
    width: 100%;
  }

  .active_nav {
    background: var(--primary-color);
    color: var(--white-color);
    transition: 0.3 ease-in-out;
  }

  .component_container {
    margin-top: 4rem;
  }

  @media only screen and (min-width: 600px) {
     .component_container {
      width: 80%;
    }
  }

  @media only screen and (min-width: 768px) {
    .component_container {
      width: 70%;
    }
  }

  @media only screen and (min-width: 992px) {
    .component_container {
      width: 60%;
    }
  }

  @media only screen and (min-width: 1200px) {
    .component_container {
      width: 40%;
    }
  }

`

export default RegisterPage