import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProfilePage } from './pages';
import { DEFAULT_USERNAME } from './constants';
import './styles/global.css';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/${DEFAULT_USERNAME}`} replace />} />
        <Route path="/:username/*" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
