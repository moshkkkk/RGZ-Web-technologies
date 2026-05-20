import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Watch from './pages/Watch';
import Upload from './pages/Upload';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p className="loading">Загрузка...</p>;
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />

      {/* Туманности */}
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      <div className="nebula nebula-3" />

      {/* Луна */}
      <div className="moon">
        <div className="moon-crater" />
        <div className="moon-crater" />
        <div className="moon-crater" />
      </div>

      {/* Падающие звёзды */}
      <div className="shooting-star" />
      <div className="shooting-star" />
      <div className="shooting-star" />

      {/* Звёзды */}
      <div className="stars-container">
       {'★✦✧★✦✧★✦★✧✦★✧✦★✦✧★✦✧★✦✧★✦★✧✦★✧✦★✦✧★✦✧★✦✧★✦'.split('').map((s, i) => (
        <span key={i} className="star">{s}</span>
       ))}
      </div>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}