import React from 'react'
import styled from 'styled-components';
import {MainSection} from '../components/symptomChecker';

const DiagnosisPage = () => {
  return (
    <Wrapper>
      <MainSection/>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    width: 100%;
    height: auto;
`

export default DiagnosisPage