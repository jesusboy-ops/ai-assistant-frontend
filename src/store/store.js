// Redux store configuration using Redux Toolkit with persistence
// Manages global state for auth, chat, emails, notes, calendar, files, notifications, and study features

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
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
import studyReducer from './slices/studySlice';

// Combine all reducers
const rootReducer = combineReducers({
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
  study: studyReducer
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'tasks', 'reminders', 'notes', 'calendar', 'study'] // Only persist these slices
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export const persistor = persistStore(store);
export default store;
