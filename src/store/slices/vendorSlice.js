import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vendorService } from '../../services/vendorService';

export const fetchVendors = createAsyncThunk(
  'vendors/fetchVendors',
  async (_, { rejectWithValue }) => {
    try {
      return await vendorService.getAll();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch vendors');
    }
  }
);

export const fetchVendorById = createAsyncThunk(
  'vendors/fetchVendorById',
  async (id, { rejectWithValue }) => {
    try {
      return await vendorService.getById(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch vendor details');
    }
  }
);

export const uploadVendorDocument = createAsyncThunk(
  'vendors/uploadVendorDocument',
  async ({ id, docData }, { rejectWithValue }) => {
    try {
      return await vendorService.uploadDocument(id, docData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload document');
    }
  }
);

const initialState = {
  vendors: [],
  selectedVendor: null,
  loading: false,
  detailLoading: false,
  error: null
};

const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    clearSelectedVendor(state) {
      state.selectedVendor = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVendorById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedVendor = action.payload;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      .addCase(uploadVendorDocument.fulfilled, (state, action) => {
        const index = state.vendors.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.vendors[index] = action.payload;
        }
        if (state.selectedVendor && state.selectedVendor.id === action.payload.id) {
          state.selectedVendor = action.payload;
        }
      });
  }
});

export const { clearSelectedVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
