import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './Home';
import Trades from './Trades';

export default function App() {
  return (
    <div>
      {/* Simple nav */}
      <nav className="p-4 space-x-4 bg-base-200">
        <NavLink to="/" end className="btn btn-ghost">
          Home
        </NavLink>
        <NavLink to="/trades" className="btn btn-ghost">
          Live Trades
        </NavLink>
      </nav>

      {/* Route outlet */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trades" element={<Trades />} />
      </Routes>
    </div>
  );
}
