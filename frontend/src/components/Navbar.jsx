import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">🎪 Ютубчик на минималках</Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/upload">Загрузить</Link>
            <Link to="/profile">{user.username}</Link>
          </>
        ) : (
          <>
            <Link to="/login">Войти</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
      </div>
    </nav>
  );
}