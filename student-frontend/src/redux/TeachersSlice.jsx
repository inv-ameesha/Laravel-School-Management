import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTeachers = createAsyncThunk('teachers/fetch', async (_, { getState }) => {
  const token = getState().auth.token;
  const res = await axios.get('http://127.0.0.1:8000/api/teachers', {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(res.data); // 🔍 See what your backend is returning

  // if your backend returns { teachers: [...] }
  return res.data.teachers || res.data;
});

const teacherSlice = createSlice({
  name: 'teachers',
  initialState: { list: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
       .addCase(fetchTeachers.rejected, (state) => {
        state.loading = false;
        console.error("Failed to fetch teachers.");
      });
  },
});

export default teacherSlice.reducer;
