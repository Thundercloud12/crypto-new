import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  [key: string]: any; 
}

export interface FetchCoinsParams {
  vsCurrency?: string;
  perPage?: number;
  page?: number;
}


export const fetchCoins = createAsyncThunk<
  Coin[],                    // return type of payload
  FetchCoinsParams | void,   // argument type
  { rejectValue: string }    // thunkAPI.rejectWithValue type
>(
  'crypto/fetchCoins',
  async (
    { vsCurrency = 'usd', perPage = 50, page = 1 } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get<Coin[]>(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: vsCurrency,
            order: 'market_cap_desc',
            per_page: perPage,
            page,
            sparkline: false,
          },
        }
      );
      console.log(response.data[0]);
      
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


interface CryptoState {
  coins: Coin[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}


const initialState: CryptoState = {
  coins: [],
  status: 'idle',
  error: null,
};


const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchCoins.fulfilled,
        (state, action: PayloadAction<Coin[]>) => {
          state.status = 'succeeded';
          state.coins = action.payload;
        }
      )
      .addCase(fetchCoins.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Unknown error';
      });
  },
});

export default cryptoSlice.reducer;
