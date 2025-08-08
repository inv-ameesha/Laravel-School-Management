import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
//get student data from API
//createAsyncThunk : used in Redux toolkits for handling API calls
//students/fetch : action name nad rest get the student details
export const fetchStudents = createAsyncThunk('students/fetch', async (_, { getState }) => {
  const res = await api.get('/students');
  return res.data;//data
});
//for student list obtaining create a student state management
const studentSlice = createSlice({
  name: 'students',//name of slice
  initialState: { list: [], loading: false },//initial state
  //extraReducers : used when you need ur slice to perform action outside the studentslice
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => { state.loading = true; })//loading state
      .addCase(fetchStudents.fulfilled, (state, action) => {//once the api call response is obtained
        state.loading = false;//make loading false
        state.list = action.payload;//action.payload contains data returned by api
      });
  },
});

export default studentSlice.reducer;//export to add to store
