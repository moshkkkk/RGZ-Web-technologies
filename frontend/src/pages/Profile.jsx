import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Profile() {
  const { user, logout } = useAuth();
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/videos/').then(res => {
      setVideos(res.data.filter(v => v.author?.id === user?.id));
    });
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить видео?')) return;
    await api.delete(`/videos/${id}/`);
    setVideos(videos.filter(v => v.id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h2>{user?.username}</h2>
        <p>{user?.email}</p>
        <button onClick={handleLogout} className="logout-btn">Выйти</button>
      </div>
      <h3>Мои видео</h3>
      {videos.length === 0 ? (
        <p className="empty">У вас пока нет видео. <Link to="/upload">Загрузить</Link></p>
      ) : (
        <div className="video-grid">
          {videos.map(video => (
            <div key={video.id} className="video-card">
              <Link to={`/watch/${video.id}`}>
                {video.thumbnail ? (
                  <img src={`http://127.0.0.1:8000${video.thumbnail}`} alt={video.title} />
                ) : (
                  <div className="no-thumbnail">▶</div>
                )}
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <span>{video.views_count} просмотров</span>
                </div>
              </Link>
              <button onClick={() => handleDelete(video.id)} className="delete-btn">Удалить</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}