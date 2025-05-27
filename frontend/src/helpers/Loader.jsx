import React from 'react'
import styled from 'styled-components';

const Loader = ({borderColor}) => {
  return (
    <Wrapper style={{borderRightColor: borderColor}}></Wrapper>
  )
}

const Wrapper = styled.div`
    width: 50px;
    aspect-ratio: 1;
    display: grid;
    border: 4px solid #0000;
    border-radius: 50%;
    border-right-color: var(--primary-color);
    animation: l15 1s infinite linear;

    ::before,::after {
        content: "";
        grid-area: 1/1;
        margin: 2px;
        border: inherit;
        border-radius: 50%;
        animation: l15 2s infinite;
    }

    ::after {
        margin: 8px;
        animation-duration: 3s;
    }

    @keyframes l15{ 
    100%{transform: rotate(1turn)}
    }
`
export default Loader
