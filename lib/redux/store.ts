import { configureStore } from "@reduxjs/toolkit"
import uiReducer from "./slices/uiSlice"
import habitsReducer from "./slices/habitsSlice"
import notesReducer from "./slices/notesSlice"

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    habits: habitsReducer,
    notes: notesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
