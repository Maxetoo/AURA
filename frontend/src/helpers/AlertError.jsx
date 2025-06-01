import React from 'react'
import styled from 'styled-components'
import { ImCross } from 'react-icons/im'

const AlertError = ({ message, width}) => {
  return (
    <Wrapper style={{width}}>
        <p className='alert-texts'>{message}</p>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  min-height: 35px;
  /* max-height: 50px; */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 2rem;
  /* background: #f2dede; */
  color: var(--error-color);
  padding: 1rem;
  border-radius: 5px;


  .alert-texts {
    margin: 0;
    padding: 0;
    font-size: 1em;
    width: 100%;
    height: 100%;
    text-align: center;
  }

  .exit-btn {
    font-size: 0.7em;
  }
`
export default AlertError