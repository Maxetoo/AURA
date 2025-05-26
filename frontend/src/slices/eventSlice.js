import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    menuOpen: false,
    showHowMatchWorks: false,
}


const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        toggleMenuOpen: (state) => {
            state.menuOpen = !state.menuOpen
        },
        toggleShowHowMatchWorks: (state) => {
            state.showHowMatchWorks = !state.showHowMatchWorks
        },
    },  
})

export default eventSlice.reducer
export const {
  toggleMenuOpen,
  toggleShowHowMatchWorks
} = eventSlice.actions