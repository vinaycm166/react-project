import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  kpis: {
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalVendors: 0,
    totalRisks: 0,
    complianceIssues: 0
  },
  loading: false
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setKpis(state, action) {
      state.kpis = action.payload;
    }
  }
});

export const { setKpis } = dashboardSlice.actions;
export default dashboardSlice.reducer;
