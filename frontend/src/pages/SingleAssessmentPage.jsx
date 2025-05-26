import React from 'react'
import styled from 'styled-components';
import AssessmentSection from '../components/assessment/AssessmentSection';

const SingleAssessmentPage = () => {
  return (
    <Wrapper>
        <AssessmentSection/>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: auto;
`
export default SingleAssessmentPage