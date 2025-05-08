// src/pages/Home.tsx
import { useEffect, useState, useRef, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../src/store/store';
import { fetchCoins } from '../src/store/slices/CryptoSlice';
import { openBinanceSocket } from '../src/api/binanceSocket';
import { WS_DISCONNECT } from '../src/store/slices/binanceSlice';


const MAX_POINTS = 7;
const ROWS_PER_PAGE = 5;

export default function Home() {
  const dispatch = useAppDispatch();
  const { coins, status } = useAppSelector((s) => s.crypto);


  // Search & filter state
  const [search, setSearch] = useState('');
  const [moverFilter, setMoverFilter] = useState<'all' | 'gainers' | 'losers'>('all');

  // Pagination state
  const [page, setPage] = useState(1);
  const buffersRef = useRef<Record<string, number[]>>({});
  const [buffers, setBuffers] = useState<Record<string, number[]>>({});
  buffersRef.current = buffers;

  // Fetch REST once
  useEffect(() => {
    dispatch(fetchCoins());
  }, [dispatch]);


  

  // Filter & sort coins
  const filtered = useMemo(() => {
    let arr = coins.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
    );
    if (moverFilter === 'gainers') {
      arr = arr.filter(c => c.price_change_24h > 0)
               .sort((a,b) => b.price_change_24h - a.price_change_24h);
    } else if (moverFilter === 'losers') {
      arr = arr.filter(c => c.price_change_24h <= 0)
               .sort((a,b) => a.price_change_24h - b.price_change_24h);
    }
    return arr;
  }, [coins, search, moverFilter]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const start = (page - 1) * ROWS_PER_PAGE;
  const pageCoins = filtered.slice(start, start + ROWS_PER_PAGE);

  if (status === 'loading') {
    return <div className="flex justify-center p-8"><span className="loading loading-spinner text-4xl"/></div>;
  }

  return (
    <div className="p-4 space-y-6">
      {/* controls */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Search by name or symbol"
          className="input input-bordered flex-1 max-w-xs"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="select select-bordered max-w-xs"
          value={moverFilter}
          onChange={(e) => { setMoverFilter(e.target.value as any); setPage(1); }}
        >
          <option value="all">All Coins</option>
          <option value="gainers">Top Gainers</option>
          <option value="losers">Top Losers</option>
        </select>
      </div>

      {/* table */}
      <div className="flex justify-center my-4">
        <div className="overflow-x-auto w-full max-w-screen">
          <table className="table table-striped w-full">
            <thead>
              <tr>
                <th>Coin</th><th>Name</th>
                <th>24h Δ</th><th>24h High</th>
                <th>24h Low</th><th>Price</th>
              </tr>
            </thead>
            <tbody>
              {pageCoins.map((coin) => {
                return (
                  <tr key={coin.symbol} className="hover:bg-base-200">
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="mask mask-squircle h-8 w-8">
                            <img src={coin.image} alt={coin.symbol} />
                          </div>
                        </div>
                        <span>{coin.symbol}</span>
                      </div>
                    </td>
                    <td>{coin.name}</td>
                    <td className={coin.price_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {coin.price_change_24h > 0 ? '+' : ''}{coin.price_change_24h.toFixed(2)}%
                    </td>
                    <td>${coin.high_24h.toLocaleString()}</td>
                    <td>${coin.low_24h.toLocaleString()}</td>
                    <td>${coin.current_price.toLocaleString()}</td>
  
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* pagination */}
      <div className="flex justify-center">
        <div className="btn-group">
          <button
            className="btn"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            « Prev
          </button>
          <button className="btn btn-disabled">
            {page} / {totalPages}
          </button>
          <button
            className="btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next »
          </button>
        </div>
      </div>
    </div>
  );
}
