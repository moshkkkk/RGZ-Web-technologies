import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Watch() {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get(`/videos/${id}/`)
      .then(res => setVideo(res.data))
      .finally(() => setLoading(false));

    api.get(`/videos/${id}/comments/`)
      .then(res => setComments(res.data));
  }, [id]);

  const handleComment = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const res = await api.post(`/videos/${id}/comments/`, { text });
      setComments([res.data, ...comments]);
      setText('');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p className="loading">Загрузка...</p>;
  if (!video) return <p className="error">Видео не найдено.</p>;

  return (
    <div className="watch">
      {/* Плеер */}
      <div className="video-player-wrapper">
        <video
          controls
          autoPlay
          src={`http://127.0.0.1:8000/api/videos/${id}/stream/`}
        />
      </div>

      {/* Инфо о видео */}
      <div className="watch-info">
        <h2>{video.title}</h2>
        <div className="watch-meta">
          <span className="author">👤 {video.author?.username}</span>
          <span className="views">👁 {video.views_count} просмотров</span>
        </div>
        {video.description && (
          <p className="description">{video.description}</p>
        )}
      </div>

      {/* Комментарии */}
      <div className="comments-section">
        <h3>Комментарии ({comments.length})</h3>

        {user ? (
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Напишите комментарий..."
              rows={3}
            />
            <button type="submit" disabled={sending}>
              {sending ? 'Отправка...' : 'Отправить'}
            </button>
          </form>
        ) : (
          <p className="login-prompt">
            <a href="/login">Войдите</a>, чтобы оставить комментарий.
          </p>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="empty">Комментариев пока нет. Будьте первым!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">👤 {comment.author?.username}</span>
                  <span className="comment-date">
                    {new Date(comment.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}