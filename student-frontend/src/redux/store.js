import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './StudentsSlice';
//import teacherReducer from './TeachersSlice';

export const store = configureStore({
  reducer: {
    students: studentReducer,
    //teachers: teacherReducer,
  },
});
