import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { procurementService } from '../../services/procurementService';

export const fetchRequests = createAsyncThunk(
  'procurement/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      return await procurementService.getAll();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch requests');
    }
  }
);

export const fetchRequestById = createAsyncThunk(
  'procurement/fetchRequestById',
  async (id, { rejectWithValue }) => {
    try {
      return await procurementService.getById(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch request details');
    }
  }
);

export const createRequest = createAsyncThunk(
  'procurement/createRequest',
  async (requestData, { rejectWithValue }) => {
    try {
      return await procurementService.create(requestData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create request');
    }
  }
);

export const updateRequestStatus = createAsyncThunk(
  'procurement/updateRequestStatus',
  async ({ id, status, action, comment }, { rejectWithValue }) => {
    try {
      return await procurementService.updateStatus(id, status, action, comment);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update request status');
    }
  }
);

export const addRequestComment = createAsyncThunk(
  'procurement/addRequestComment',
  async ({ id, comment }, { rejectWithValue }) => {
    try {
      return await procurementService.addComment(id, comment);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add comment');
    }
  }
);

const initialState = {
  requests: [],
  selectedRequest: null,
  loading: false,
  detailLoading: false,
  error: null,
  filters: {
    search: '',
    status: 'All',
    department: 'All'
  }
};

const procurementSlice = createSlice({
  name: 'procurement',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    clearSelectedRequest(state) {
      state.selectedRequest = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetch all requests
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetch request by id
      .addCase(fetchRequestById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchRequestById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedRequest = action.payload;
      })
      .addCase(fetchRequestById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      // create request
      .addCase(createRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.unshift(action.payload);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // update status
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        const index = state.requests.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.selectedRequest && state.selectedRequest.id === action.payload.id) {
          state.selectedRequest = action.payload;
        }
      })
      // add comment
      .addCase(addRequestComment.fulfilled, (state, action) => {
        const index = state.requests.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.selectedRequest && state.selectedRequest.id === action.payload.id) {
          state.selectedRequest = action.payload;
        }
      });
  }
});

export const { setFilter, resetFilters, clearSelectedRequest } = procurementSlice.actions;
export default procurementSlice.reducer;
