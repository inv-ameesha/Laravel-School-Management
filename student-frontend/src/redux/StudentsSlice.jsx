import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchStudents = createAsyncThunk('students/fetch', async (_, { getState }) => {
  const token = localStorage.getItem('token'); // Assuming token is stored in auth
  const res = await axios.get('http://127.0.0.1:8000/api/students', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

const studentSlice = createSlice({
  name: 'students',
  initialState: { list: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => { state.loading = true; })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      });
  },
});

export default studentSlice.reducer;
