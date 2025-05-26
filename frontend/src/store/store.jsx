import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../slices/authSlice'
import eventSlice from '../slices/eventSlice'
import userSlice from '../slices/userSlice'
import analysisSlice from '../slices/assessmentSlice'
import uploadSlice from '../slices/uploadSlice'


export const store = configureStore({
    reducer: {
        auth: authSlice,
        event: eventSlice,
        user: userSlice,
        assessment: analysisSlice,
        upload: uploadSlice
    }
})