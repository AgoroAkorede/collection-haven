import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Search } from './pages/Search';
import { CardDetails } from './pages/CardDetails';
import { Profile } from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="search" element={<Search />} />
          <Route path="shop" element={<div className="p-8 text-center text-zinc-500">Shop coming soon</div>} />
          <Route path="social" element={<div className="p-8 text-center text-zinc-500">Social coming soon</div>} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/card/:id" element={<CardDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
