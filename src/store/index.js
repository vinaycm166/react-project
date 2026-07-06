import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import procurementReducer from './slices/procurementSlice';
import vendorReducer from './slices/vendorSlice';
import riskReducer from './slices/riskSlice';
import complianceReducer from './slices/complianceSlice';
import auditReducer from './slices/auditSlice';
import reportReducer from './slices/reportSlice';
import notificationReducer from './slices/notificationSlice';
import dashboardReducer from './slices/dashboardSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  procurement: procurementReducer,
  vendors: vendorReducer,
  risk: riskReducer,
  compliance: complianceReducer,
  audit: auditReducer,
  reports: reportReducer,
  notifications: notificationReducer,
  dashboard: dashboardReducer
});

const persistConfig = {
  key: 'egrcp_root',
  storage: storage?.default || storage,
  whitelist: ['auth', 'ui']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export const persistor = persistStore(store);
export default store;
