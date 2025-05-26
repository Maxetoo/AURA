import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { URL } from '../paths/url';

const initialState = {
  isLoading: false,
  isError: false,
  errorMessage: '',
  images: [],
  files: {
    certificate: '',
    resume: '',
    profilePicture: ''
  },
  selectedInput: ''
};

export const uploadFile = createAsyncThunk(
  'actions/upload',
  async ({ file, fileType }) => {
    const formData = new FormData();
    formData.append('file', file); 

    try {
      const resp = await axios.post(
        `${URL}/api/v1/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      return { response: resp.data, fileType, status: 'success' };
    } catch (error) {
      return {
        response: error.response?.data || { msg: 'Unknown error occurred' },
        status: 'error',
        code: error.response?.status || 500,
      };
    }
  }
);


const authSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    getImageFile: (state, action) => {
      state.files = action.payload;
    },
    handleSelectedInput: (state, action) => {
        state.selectedInput = action.payload
    },
    removeSelectedFile: (state, action) => {
        state.files[action.payload] = ''
    },
    removeImage: (state) => {
      state.files = {
        certificate: '',
        resume: '',
        profilePicture: ''
      };
      state.images = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        const { response, fileType, status } = action.payload;
        state.isLoading = false;

        if (status === 'success') {
            state.isError = false;
            if (response && response.files && response.files[0]) {
            state.files[fileType] = response.files[0]; 
            }
        } else {
            state.isError = true;
            state.errorMessage = response.msg;
        }
        })
      .addCase(uploadFile.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = 'Something went wrong';
      });
  }
});

export default authSlice.reducer;
export const {
  getImageFile,
  removeImage,
  handleSelectedInput,
  removeSelectedFile
} = authSlice.actions;
