import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auditService } from '../../services/auditService';

export const fetchAuditLogs = createAsyncThunk(
  'audit/fetchAuditLogs',
  async (_, { rejectWithValue }) => {
    try {
      return await auditService.getLogs();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch audit logs');
    }
  }
);

const initialState = {
  logs: [],
  loading: false,
  error: null
};

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default auditSlice.reducer;
