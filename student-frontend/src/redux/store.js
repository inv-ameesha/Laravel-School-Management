import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './StudentsSlice';

export const store = configureStore({
  reducer: {
    students: studentReducer,//student reducer registered to student key
  },
});
