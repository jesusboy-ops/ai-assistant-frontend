// Redux store configuration using Redux Toolkit
// Manages global state for auth, chat, emails, notes, calendar, files, notifications, and new features

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import emailReducer from './slices/emailSlice';
import notesReducer from './slices/notesSlice';
import calendarReducer from './slices/calendarSlice';
import filesReducer from './slices/filesSlice';
import notificationsReducer from './slices/notificationsSlice';
import dictionaryReducer from './slices/dictionarySlice';
import tasksReducer from './slices/tasksSlice';
import translatorReducer from './slices/translatorSlice';
import remindersReducer from './slices/remindersSlice';
import mathReducer from './slices/mathSlice';
import documentSummarizerReducer from './slices/documentSummarizerSlice';
import smartBookshelfReducer from './slices/smartBookshelfSlice';
import lifeAdminReducer from './slices/lifeAdminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    email: emailReducer,
    notes: notesReducer,
    calendar: calendarReducer,
    files: filesReducer,
    notifications: notificationsReducer,
    dictionary: dictionaryReducer,
    tasks: tasksReducer,
    translator: translatorReducer,
    reminders: remindersReducer,
    math: mathReducer,
    documentSummarizer: documentSummarizerReducer,
    smartBookshelf: smartBookshelfReducer,
    lifeAdmin: lifeAdminReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For handling File objects and dates
    })
});

export default store;
