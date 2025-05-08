// src/pages/Trades.tsx
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { openBinanceSocket } from '../api/binanceSocket';
import { WS_DISCONNECT } from '../store/slices/binanceSlice';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import shallowEqual from 'shallowequal';

const PAGE_SIZE = 5;
const symbols = [
  'btcusdt', 'ethusdt', 'bnbusdt', 'adausdt', 'xrpusdt',
  'solusdt', 'dogeusdt', 'maticusdt', 'ltcusdt', 'dotusdt'
];

export default function Trades() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);

  const { trades, sparklines, status: wsStatus } = useAppSelector(
    (s) => ({
      trades: s.binance.trades,
      sparklines: s.binance.sparklines,
      status: s.binance.status
    }),
    shallowEqual
  );

  useEffect(() => {
    const socket = openBinanceSocket(dispatch, symbols.map(s => `${s}@trade`));
    return () => {
      socket.close();
      dispatch(WS_DISCONNECT());
    };
  }, [dispatch]);

  const paginatedTrades = useMemo(() => {
    const sorted = symbols
      .map((sym) => trades[sym.toUpperCase()])
      .filter(Boolean);
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [trades, page]);

  const totalPages = Math.ceil(symbols.length / PAGE_SIZE);

  if (wsStatus === 'connecting') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4">
      <div className="overflow-x-auto max-w-5xl mx-auto flex-grow">
        <table className="table w-full table-fixed border-separate border-spacing-y-10">
          <thead>
            <tr>
              <th className="w-[100px]">Symbol</th>
              <th className="w-[120px]">Price (USDT)</th>
              <th className="w-[100px]">Quantity</th>
              <th className="w-[160px]">7-sec Sparkline</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrades.map((t) => {
              const buf = sparklines[t.s] || [];
              return (
                <tr key={t.s} className="hover:bg-base-200">
                  <td>{t.s}</td>
                  <td>${parseFloat(t.p).toFixed(2)}</td>
                  <td>{parseFloat(t.q)}</td>
                  <td>
                    <div className="h-[40px]">
                      {buf.length > 0 ? (
                        <Sparklines data={buf} width={140} height={40}>
                          <SparklinesLine style={{ strokeWidth: 2 }} />
                        </Sparklines>
                      ) : (
                        <span className="text-gray-400 text-sm">No data</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        <button
          className="btn btn-sm"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          « Prev
        </button>
        <button className="btn btn-sm btn-disabled">
          {page} / {totalPages}
        </button>
        <button
          className="btn btn-sm"
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        >
          Next »
        </button>
      </div>
    </div>
  );
}
