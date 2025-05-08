// src/store/slices/binanceSlice.ts
import { createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface BinanceTrade {
  s: string;    // Symbol, e.g. "BTCUSDT"
  p: string;    // Price as string
  q: string;    // Quantity as string
  sparkline?:number[]
}

interface BinanceState {
  trades: Record<string, BinanceTrade>;
  sparklines: Record<string, number[]>;   // <— new: price buffers
  status: 'idle' | 'connecting' | 'connected' | 'disconnected';
}

const initialState: BinanceState = {
  trades: {},
  sparklines: {},
  status: 'idle',
};

const MAX_POINTS = 7;

const binanceSlice = createSlice({
  name: 'binance',
  initialState,
  reducers: {
    WS_CONNECT:    (s) => { s.status = 'connecting'; },
    WS_CONNECTED:  (s) => { s.status = 'connected'; },
    WS_DISCONNECT: (s) => { s.status = 'disconnected'; },
    WS_UPDATE_BATCH: (
      s,
      action: PayloadAction<Record<string, BinanceTrade>>
    ) => {
      for (const [sym, trade] of Object.entries(action.payload)) {
        // 1) update latest trade
        s.trades[sym] = trade;

        // 2) update sparkline buffer
        const price = parseFloat(trade.p);
        const buf = s.sparklines[sym] ?? [];
        buf.push(price);
        if (buf.length > MAX_POINTS) buf.shift();
        s.sparklines[sym] = buf;
      }
    },
  },
  
});

export const {
  WS_CONNECT,
  WS_CONNECTED,
  WS_DISCONNECT,
  WS_UPDATE_BATCH,
} = binanceSlice.actions;

export default binanceSlice.reducer;
