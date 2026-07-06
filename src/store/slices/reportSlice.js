import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reportService } from '../../services/reportService';

export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      return await reportService.getSavedReports();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch reports');
    }
  }
);

const initialState = {
  savedReports: [],
  loading: false,
  error: null
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.savedReports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default reportSlice.reducer;
