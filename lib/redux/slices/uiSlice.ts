import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  drawerOpen: boolean
  loading: boolean
  isOnline: boolean
}

const initialState: UiState = {
  drawerOpen: false,
  loading: false,
  isOnline: true,
}

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.drawerOpen = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload
    },
  },
})

export const { setDrawerOpen, setLoading, setOnlineStatus } = uiSlice.actions

export default uiSlice.reducer
