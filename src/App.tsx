import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './components/Home';
import Trades from './components/Trades';
import Favourites from './components/Favourites';

export default function App() {
  return (
    <div>
      {/* Simple nav */}
      <nav className="p-4 space-x-4 bg-base-200 flex justify-center items-center">
        <NavLink to="/" end className="btn btn-ghost">
          Home
        </NavLink>
        <NavLink to="/trades" className="btn btn-ghost">
          Live Trades
        </NavLink>
        <NavLink to="/favourites" className="btn btn-ghost">
          Favourite
        </NavLink>
      </nav>

      {/* Route outlet */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trades" element={<Trades />} />
        <Route path="/favourites" element={<Favourites />} />
      </Routes>
    </div>
  );
}
