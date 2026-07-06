import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  themeMode: 'light',
  sidebarOpen: true
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
    },
    setTheme(state, action) {
      state.themeMode = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebar(state, action) {
      state.sidebarOpen = action.payload;
    }
  }
});

export const { toggleTheme, setTheme, toggleSidebar, setSidebar } = uiSlice.actions;
export default uiSlice.reducer;
