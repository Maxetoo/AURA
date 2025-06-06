import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import {URL} from '../paths/url'


const initialState = {
    errorMessage: '',
    isError: false,
    isLoading: false,
    generateAssesssmentLoad: false,
    generateAssesssmentError: false,
    matchTherapistLoad: false,
    matchTherapistError: false,
    getAssessmentLoad: false,
    getAssessmentError: false,
    symptoms: '',
    suggestedTests: {},
    assessments: [],
    generatedAssessments: {},
    review: {
      testCode: '',
      answers: []
    },
    analysisId: '',
    selectedAssessment: '',
    currentAssessmentAnalysis: '',
    currentAssessment: {},
    therapistMatches: {}
}

export const runAnalysis = createAsyncThunk(
    'actions/runAnalysis',
    async (payload, thunkApi) => {
        const {symptoms} = payload

        try {
        const resp = await axios.post(
          `${URL}/api/v1/analysis`, 
          {
            symptoms
          },
          {
            withCredentials: true,
          }
        )
        thunkApi.dispatch(getAssessments({analysisId: resp.data?.suggestedTests?._id}))
        return { response: resp.data, status: 'success' }
      } catch (error) {
        return {
          response: error.response.data,
          status: 'error',
          code: error.response.status,
        }
      }
    }
  )

  export const generateQuestions = createAsyncThunk(
    'actions/generateQuestions',
    async (payload, thunkApi) => {
        const {test, reason} = payload
        thunkApi.dispatch(handleSelectAssessment(test))
        try {
        const resp = await axios.post(
          `${URL}/api/v1/analysis/generate-questions`, 
          {
            test,
            reason
          },
          {
            withCredentials: true,
          }
        )
        return { response: resp.data, status: 'success' }
      } catch (error) {
        return {
          response: error.response.data,
          status: 'error',
          code: error.response.status,
        }
      }
    }
  )

  export const getAssessments = createAsyncThunk(
    'actions/getAssessments',
    async (payload) => {
        const {analysisId} = payload

        try { 
        const resp = await axios.get(
          `${URL}/api/v1/analysis/assessment/${analysisId}`, 
          {
            withCredentials: true,
          }
        )
        return { response: resp.data, status: 'success' }
      } catch (error) {
        return {
          response: error.response.data,
          status: 'error',
          code: error.response.status,
        }
      }
    }
  )

  export const addAssessment = createAsyncThunk(
    'actions/addAssessment',
    async (payload, thunkApi) => {
        const {analysisId, review} = payload
        try {
        const resp = await axios.post(
          `${URL}/api/v1/analysis/add-assessment`, 
          {
            analysisId,
            review
          },
          {
            withCredentials: true,
          }
        )
        thunkApi.dispatch(getAssessments({analysisId}))
        return { response: resp.data, status: 'success' }
      } catch (error) {
        return {
          response: error.response.data,
          status: 'error',
          code: error.response.status,
        }
      }
    }
  )

  export const matchTherapist = createAsyncThunk(
    'actions/matchTherapist',
    async () => {

      try {
        const resp = await axios.get(
          `${URL}/api/v1/analysis/match-therapist`, 
          {
            withCredentials: true,
          }
        )
        return { response: resp.data, status: 'success' }
      } catch (error) {
        return {
          response: error.response.data,
          status: 'error',
          code: error.response.status,
        }
      }
    }
  )


const analysisSlice = createSlice({
    name: 'analysis',
    initialState,
    reducers: {
      fillSymptomInput: (state, action) => {
        state.symptoms = action.payload
      },
      updateReview: (state, action) => {
        const {testCode, answers} = action.payload
        state.review.testCode = testCode
        state.review.answers = answers
      },
      handleSelectAssessment: (state, action) => {
        state.selectedAssessment = action.payload
      },
    },
    extraReducers(builder) {
        builder
        .addCase(runAnalysis.pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
        .addCase(runAnalysis.fulfilled, (state, action) => {
            const { status, response} = action.payload
            if (status === 'success') {
                state.isLoading = false
                state.suggestedTests = response.suggestedTests || {}
                state.assessments = response.suggestedTests?.assessments || []
                state.analysisId = response.suggestedTests?._id
                state.symptoms = ''
            } else {
                state.isLoading = false
                state.isError = true
                state.errorMessage = response.message                
            }
        })
        .addCase(runAnalysis.rejected, (state) => {
          state.isLoading = false
          state.isError = true
          state.errorMessage = 'Network error'
        })
        .addCase(generateQuestions.pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
        .addCase(generateQuestions.fulfilled, (state, action) => {
            const { status, response} = action.payload
            if (status === 'success') {
                state.isLoading = false
                state.generatedAssessments = response.assessment
                state.analysisId = response.assessment?._id
            } else {
                state.isLoading = false
                state.isError = true
                state.errorMessage = response.message                
            }
        })
        .addCase(generateQuestions.rejected, (state) => {
          state.isLoading = false
          state.isError = true
          state.errorMessage = 'Network error'
        })
        .addCase(getAssessments.pending, (state) => {
          state.getAssessmentLoad = true
          state.getAssessmentError = false
        })
        .addCase(getAssessments.fulfilled, (state, action) => {
            const { status, response} = action.payload
            if (status === 'success') {
                state.getAssessmentLoad = false
                state.currentAssessment = response
            } else {
                state.getAssessmentLoad = false
                state.getAssessmentError = true
                state.errorMessage = response.message                
            }
        })
        .addCase(getAssessments.rejected, (state) => {
          state.getAssessmentLoad = false
          state.getAssessmentError = true
          state.errorMessage = 'Network error'
        })
        .addCase(addAssessment.pending, (state) => {
          state.generateAssesssmentLoad = true
          state.generateAssesssmentError = false
        })
        .addCase(addAssessment.fulfilled, (state, action) => {
            const { status, response} = action.payload
            if (status === 'success') {
                state.generateAssesssmentLoad = false   
            } else {
                state.generateAssesssmentLoad = false
                state.generateAssesssmentError = true
                state.errorMessage = response.message                
            }
        })
        .addCase(addAssessment.rejected, (state) => {
          state.generateAssesssmentLoad = false
          state.generateAssesssmentError = true
          state.errorMessage = 'Network error'
        })
        .addCase(matchTherapist.pending, (state) => {
          state.matchTherapistLoad = true
          state.matchTherapistError = false
        })
        .addCase(matchTherapist.fulfilled, (state, action) => {
            const { status, response} = action.payload
            if (status === 'success') {
                state.matchTherapistLoad = false
                state.therapistMatches = response   
            } else {
                state.matchTherapistLoad = false
                state.matchTherapistError = true
                state.errorMessage = response.message                
            }
        })
        .addCase(matchTherapist.rejected, (state) => {
          state.matchTherapistLoad = false
          state.matchTherapistError = true
          state.errorMessage = 'Network error'
        })
    }
})

export default analysisSlice.reducer
export const {
    fillSymptomInput,
    updateReview,
    handleSelectAssessment
} = analysisSlice.actions