import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import {URL} from '../paths/url'
// import Cookies from 'js-cookie'

const initialState = {
    // profile 
    isAdmin: false,
    errorMessage: '',
    isError: false,
    isLoading: false,
    user: {},
}

export const getProfile = createAsyncThunk(
    'actions/getProfile',
    async () => {

        try {
        const resp = await axios.get(
          `${URL}/api/v1/user`, 
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


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      rmErrorMessage: (state) => 
        state.errorMessage = ''
    },
    extraReducers(builder) {
        builder
        .addCase(getProfile.pending, (state) => {
          state.isLoading = true
          state.isError = false
        })
        .addCase(getProfile.fulfilled, (state, action) => {
            const { status, response} = action.payload
            if (status === 'success') {
                state.isLoading = false
                state.user = response.user || {}
                state.isAdmin = response.user.isAdmin || false
            } else {
                state.isLoading = false
                state.isError = true
                state.errorMessage = response.message               
            }
        })
        .addCase(getProfile.rejected, (state) => {
          state.isLoading = false
          state.isError = true
          state.errorMessage = 'Network error'
        })
    }
})

export default userSlice.reducer
export const {
    rmErrorMessage
} = userSlice.actions