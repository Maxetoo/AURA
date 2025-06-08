import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'
import {URL} from '../paths/url'
import { getProfile } from './userSlice'

const storedUserConfirmation = localStorage.getItem('confirmationWait')
    ? JSON.parse(localStorage.getItem('confirmationWait'))
    : false

const initialState = {

    // waiting for verification confirmation
    isWaitingConfirmation: storedUserConfirmation,

    isLoading: false,
    isError: '',
    errroMessage: '',
    // password visibility 

    isLoginPasswordVisible: false,
    isSignupPasswordVisiblePatient: false,
    isSignupPasswordVisibleTherapist: false,


    // login 
    loginInputs: {
        email: '',
        password: '',
    },
    loginErrorMessage: '',
    loginLoad: false,
    loginError: false,

    // signup 
    signupInputs: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        dateOfBirth: '',
        role: '',
        governmentIssuedId: '',
        certifications: '',
        resume: '',
        profilePhoto: '',
        yearsOfExperience: '',
        specialties:  []
    },
    signupErrorMessage: '',
    signupLoad: false,
    signupError: false,

    // reset-password 
    resetPasswordEmail: '',
    resetPasswordLoad: false,
    resetPasswordError: false,
    resetPasswordSent: false,
    passwordResetMessage: '',

    // change password 
    changePasswordInputs: {
        newPassword: '',
        confirmPassword: ''
    },
    changePasswordLoad: false,
    changePasswordError: false,
    changePasswordErrorMessage: '',

    // logout 
    logoutLoad: false,
    logoutError: false,
    logoutErrorMsg: '',

    
    // error message 
    errorMessage: '',

    // success message
    successMessage: '',

    // user
    user: [],
    isAuthenticated: false,
    token: '',
    userCookie: Cookies.get('token') && true,
}


export const login = createAsyncThunk(
    'actions/login',
    async (payload) => {
      const { email, password } = payload
      try {
        const resp = await axios.post(
          `${URL}/api/v1/auth/login`,
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        )
        window.location.href = '/'
        return { response: resp, status: 'success' }
      } catch (error) {
        return {
          response: error.response.data,
          status: 'error',
          code: error.response.status,
        }
      }
    }
  )

  export const signup = createAsyncThunk(
    'actions/signup',
    async (payload) => {
      
      try {
        const resp = await axios.post(
          `${URL}/api/v1/auth/signup`,
          payload,
          {
            withCredentials: true,
          }
        )
        window.location.href = '/user-confirmation'
        return { response: resp, status: 'success' }
      } catch (error) {
        return {
          response: error.response.data,
          status: 'error',
          code: error.response.status,
        }
      }
    }
  )

  export const verifyUser = createAsyncThunk(
    'actions/verifyUser',
    async (payload, thunkApi) => {
      const {verificationToken} = payload
      try {
        const resp = await axios.patch(
          `${URL}/api/v1/auth/verify-account`,
          {
            verificationToken
          },
          {
            withCredentials: true,
          }
        )
        thunkApi.dispatch(getProfile())
        window.location.reload()
        return { response: resp, status: 'success' }
      } catch (error) {
        return {
          response: error.response.data,
          status: 'error',
          code: error.response.status,
        }
      }
    }
  )


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        fillLoginInputs: (state, action) => {
            state.loginInputs.email = action.payload.email;
            state.loginInputs.password = action.payload.password
        },
         fillSignupInputs: (state, action) => {
            state.signupInputs.email = action.payload.email;
            state.signupInputs.firstname = action.payload.firstname;
            state.signupInputs.lastname = action.payload.lastname
            state.signupInputs.dateOfBirth = action.payload.dateOfBirth;
            state.signupInputs.password = action.payload.password;
            state.signupInputs.governmentIssuedId = action.payload.governmentIssuedId;
            state.signupInputs.certifications = action.payload.certifications;
            state.signupInputs.profilePhoto = action.payload.profilePhoto
            state.signupInputs.role = action.payload.role
            state.signupInputs.resume = action.payload.resume
            state.signupInputs.yearsOfExperience = action.payload.yearsOfExperience
            state.signupInputs.specialties = action.payload.specialties || []
        },
        togglePasswordVisibility: (state, action) => {
          const {type} = action.payload
          if (type === 'login') {
            state.isLoginPasswordVisible = !state.isLoginPasswordVisible
          } else if (type === 'signupPatient') {
            state.isSignupPasswordVisiblePatient = !state.isSignupPasswordVisiblePatient
          } else {
            state.isSignupPasswordVisibleTherapist = !state.isSignupPasswordVisibleTherapist
          }
        },
        resetSignupInputs: (state) => {
           state.signupInputs = {
              firstname: '',
              lastname: '',
              email: '',
              password: '',
              dateOfBirth: '',
              role: '',
              governmentIssuedId: '',
              certifications: '',
              resume: '',
              profilePhoto: '',
              yearsOfExperience: '',
              specialties: []
           }
        }
    },
    extraReducers(builder) {
        // login
        builder.addCase(login.pending, (state) => {
            state.loginLoad = true
            state.loginError = false
          })
          .addCase(login.fulfilled, (state, action) => {
            state.loginLoad = true
            const { status, code, response } = action.payload

            if (code === 500) {
              state.loginLoad = false
              state.loginError = true
              state.loginErrorMessage = `Can't login due to network`
            } else if (status === 'success') {
              state.loginLoad = false
              state.loginError = false

            } else {
              state.loginLoad = false
              state.loginError = true
              state.loginErrorMessage = response.message             
            }
          })
          .addCase(login.rejected, (state) => {
            state.loginLoad = false
            state.loginError = true
            state.loginErrorMessage = 'Unable to login'
          })
          .addCase(signup.pending, (state) => {
            state.signupLoad = true
            state.signupError = false
          })
          .addCase(signup.fulfilled, (state, action) => {
            state.signupLoad = true
            const { status, code, response } = action.payload

            if (code === 500) {
              state.signupLoad = false
              state.signupError = true
              state.signupErrorMessage = `Can't login due to network`
            } else if (status === 'success') {
              state.signupLoad = false
              state.signupError = false
              state.isWaitingConfirmation = true
              localStorage.setItem(
                'confirmationWait',
                JSON.stringify(state.isWaitingConfirmation)
              );
              state.signupInputs = {
                  firstname: '',
                  lastname: '',
                  email: '',
                  password: '',
                  dateOfBirth: '',
                  role: '',
                  governmentIssuedId: '',
                  certifications: '',
                  resume: '',
                  profilePhoto: '',
                  yearsOfExperience: '',
                  specialties: []
              }
            } else {
              state.signupLoad = false
              state.signupError = true
              state.signupErrorMessage = response.message             
            }
          })
          .addCase(signup.rejected, (state) => {
            state.signupLoad = false
            state.signupError = true
            state.signupErrorMessage = 'Unable to login'
          })
          builder.addCase(verifyUser.pending, (state) => {
            state.isLoading = true
          })
          .addCase(verifyUser.fulfilled, (state, action) => {
            state.isLoading = true
            const { status, response } = action.payload

           if (status === 'success') {
              state.isLoading = false
              state.isWaitingConfirmation = false
            } else {
              state.isError = true
              state.isLoading = true
              state.errorMessage = response.message             
            }
          })
          .addCase(verifyUser.rejected, (state) => {
            state.isLoading = false
            state.isError = true
            state.errorMessage = 'Unable to verify user'
          })
    }
        
})

export default authSlice.reducer
export const {
  fillLoginInputs,
  fillSignupInputs,
  togglePasswordVisibility,
  resetSignupInputs
} = authSlice.actions