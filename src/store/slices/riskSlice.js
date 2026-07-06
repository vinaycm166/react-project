import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { riskService } from '../../services/riskService';

export const fetchRiskData = createAsyncThunk(
  'risk/fetchRiskData',
  async (_, { rejectWithValue }) => {
    try {
      return await riskService.getRiskData();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch risk data');
    }
  }
);

const initialState = {
  matrix: [],
  categories: [],
  trends: [],
  loading: false,
  error: null
};

const riskSlice = createSlice({
  name: 'risk',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiskData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRiskData.fulfilled, (state, action) => {
        state.loading = false;
        state.matrix = action.payload.matrix;
        state.categories = action.payload.categories;
        state.trends = action.payload.trends;
      })
      .addCase(fetchRiskData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default riskSlice.reducer;
