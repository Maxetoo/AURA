import React from 'react'
import styled from 'styled-components';
import {Link, Navigate, useLocation} from 'react-router-dom';
import { useSelector } from 'react-redux'


const UserConfirmationPage = () => {
    const {isWaitingConfirmation} = useSelector((store) => store.auth)
    const location = useLocation();

    if (!isWaitingConfirmation) {
        return <Navigate to='/' state={{ from: location }} replace />
    }
    
  return (
    <Wrapper>
        <div className="secondary_wrapper">
            <h3>Confirmation has been sent to your email!</h3>
            <p>Please check your inbox or spam</p>
            <Link to={'/'}>
                <button type='button'>Back Home</button>
            </Link>
        </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    height: 100vh;
    width: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .secondary_wrapper {
        margin-top: 2rem;
        width: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .mail_icon {
        margin-top: 3rem;
        font-size: 5em;
    }

    h3 {
        width: 80%;
        font-size: 1.5em;
        text-align: center;
        font-weight: 600;
        line-height: 35px;
    }

    p {
        margin-top: 2rem;
    }

    button {
        margin-top: 3rem;
        font-size: 1em;
        border: none;
        padding: 1rem 3rem;
        background: var(--primary-color);
        color: var(--white-color);
        border-radius: 35px;
    }

    @media only screen and (min-width: 992px) {
         .secondary_wrapper {
            width: 60%;
         }

         h3 {
            width: 60%;
            font-size: 2em;
         }
    }

`
export default UserConfirmationPage