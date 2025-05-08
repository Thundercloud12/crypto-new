import { useEffect, useState } from 'react';
import { useAppSelector } from '../store/store';
import { Link } from 'react-router-dom';

export default function Favourites() {
  const { coins } = useAppSelector((s) => s.crypto);
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('favourites');
    setFavs(stored ? JSON.parse(stored) : []);
  }, []);

  const favCoins = coins.filter(c => favs.includes(c.symbol));

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Favourites</h2>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
      {favCoins.length === 0 ? (
        <p>No favourite coins yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Coin</th><th>Name</th>
                <th>24h Δ</th><th>24h High</th>
                <th>24h Low</th><th>Price</th>
              </tr>
            </thead>
            <tbody>
              {favCoins.map((coin) => (
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
