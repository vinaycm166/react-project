import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  violations: [
    { id: 'VIO-001', vendor: 'Synergy Cybertech', type: 'Expired Security Certificate', severity: 'High', dateDetected: '2026-05-16', status: 'Open' },
    { id: 'VIO-002', vendor: 'Legacy Legal Associates', type: 'Invalid Liability Insurance', severity: 'Critical', dateDetected: '2026-02-10', status: 'Open' }
  ],
  loading: false,
  error: null
};

const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {
    resolveViolation(state, action) {
      const index = state.violations.findIndex(v => v.id === action.payload);
      if (index !== -1) {
        state.violations[index].status = 'Resolved';
      }
    }
  }
});

export const { resolveViolation } = complianceSlice.actions;
export default complianceSlice.reducer;
