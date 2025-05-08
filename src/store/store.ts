import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from '../store/slices/CryptoSlice';
import binanceReducer from '../store/slices/binanceSlice';

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    binance: binanceReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';

import type { TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
