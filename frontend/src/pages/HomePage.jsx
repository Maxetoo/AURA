import React from 'react'
import styled  from 'styled-components';
import {HeroSection, HowItWorksSection, PrivacySection, OnboardSection} from '../components/home';


const HomePage = () => {
  return (
    <Wrapper>
        <HeroSection/>
        <HowItWorksSection/>
        <PrivacySection/>
        <OnboardSection/>
    </Wrapper>
  )
}


const Wrapper = styled.div`
    width: 100%;
    height: auto;
`
export default HomePage