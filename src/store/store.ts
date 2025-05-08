// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from '../store/slices/CryptoSlice';
import binanceReducer from '../store/slices/binanceSlice';

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    binance: binanceReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';

import type { TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
