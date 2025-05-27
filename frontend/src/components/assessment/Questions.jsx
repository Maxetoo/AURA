import React from 'react'
import styled from 'styled-components';

const Questions = ({question, options, selectedOption, onSelectOption}) => {

  return (
    <Wrapper>
        <h3>{question}</h3>
        <div className="questions-list-container">
            {options.map((value, index) => {
                return <button 
                    key={index}
                    type='button'
                     onClick={() => onSelectOption(value)}
                    >
                    <div className={`selection-indicator ${selectedOption?.selection === value ? 'selected' : ''}`}
                    >
                        </div>
                        <p>{value}</p>
                    </button>
                })}
        </div>
    </Wrapper>
  )
}


const Wrapper = styled.div`
    margin-top: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

.questions-list-container {
    margin-top: 1rem;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}


button {
    color: var(--stroke-color);
    width: 100%;
    min-height: 60px;
    padding: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 50px;
    border: solid 0.5px var(--primary-color);
    outline: none;
    /* background:  #e8e6da; */
    background: #F7F6F5;
    margin-top: 1rem;
    cursor: pointer;
    font-size: 1em;
    gap: 1rem;
}

.selection-indicator {
    height: 30px;
    width: 30px;
    border: solid 1px var(--stroke-color);
    border-radius: 50%;
}

.selected {
    background: var(--primary-color);
    border: solid 1px var(--white-color);
    transition: 0.5s all;
}



`
export default Questions