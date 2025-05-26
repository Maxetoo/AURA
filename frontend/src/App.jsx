import React, {useEffect} from 'react'
import styled from 'styled-components';
import {HomePage, AboutPage, ErrorPage, DiagnosisPage, LoginPage, RegisterPage, AssessmentPage, SingleAssessmentPage, UserConfirmationPage, ReviewAssessmentPage, TherapyPage} from './pages';
import {HeaderLarge, HeaderSmall, Footer, NavMenu} from './components/global';
import {
  Route,
  Routes,
  useSearchParams
} from 'react-router-dom'
import {verifyUser} from './slices/authSlice';
import {getProfile} from './slices/userSlice';
import { useDispatch, useSelector } from 'react-redux'


const App = () => {
  const dispatch = useDispatch();
  const {isWaitingConfirmation} = useSelector((store) => store.auth)
  const {user} = useSelector((store) => store.user)

  const [searchParams] = useSearchParams();
  const verificationToken = searchParams.get('token');

  useEffect(() => {
    if (isWaitingConfirmation && verificationToken) {
      dispatch(verifyUser({verificationToken}))
    }
  }, [dispatch, isWaitingConfirmation, verificationToken]);

  // get user profile 
  useEffect(() => {
    if (Object.keys(user).length === 0) {
      dispatch(getProfile())
    }
  }, [user, dispatch]); 

  return (
    <Wrapper>
      <HeaderLarge/>
      <HeaderSmall/>
      <NavMenu/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/symptomChecker" element={<DiagnosisPage />} />
         <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/user-confirmation" element={<UserConfirmationPage />} />
          {/* Therapy */}
          <Route path="/review" element={<ReviewAssessmentPage />} />
           <Route path="/therapy" element={<TherapyPage />} />
        <Route path="/assessment/:id" element={<SingleAssessmentPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer/>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: auto;
`

export default App
