import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/videos/')
      .then(res => setVideos(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Загрузка...</p>;

  return (
    <div className="home">
      <h2>Все видео</h2>
      {videos.length === 0 ? (
        <p className="empty">Видео пока нет. <Link to="/upload">Загрузите первое!</Link></p>
      ) : (
        <div className="video-grid">
          {videos.map(video => (
            <Link to={`/watch/${video.id}`} key={video.id} className="video-card">
              {video.thumbnail ? (
                <img src={`http://127.0.0.1:8000${video.thumbnail}`} alt={video.title} />
              ) : (
                <div className="no-thumbnail">▶</div>
              )}
              <div className="video-info">
                <h3>{video.title}</h3>
                <p>{video.author?.username}</p>
                <span>{video.views_count} просмотров</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}