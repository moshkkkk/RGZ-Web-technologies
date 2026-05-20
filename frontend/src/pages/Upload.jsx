import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Upload() {
  const [form, setForm] = useState({ title: '', description: '' });
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) return setError('Выберите видеофайл.');
    setLoading(true);
    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('file', file);
    if (thumbnail) data.append('thumbnail', thumbnail);
    try {
      const res = await api.post('/videos/upload/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/watch/${res.data.id}`);
    } catch {
      setError('Ошибка загрузки. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Загрузить видео</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Название" onChange={handleChange} required />
        <textarea name="description" placeholder="Описание" onChange={handleChange} />
        <label>Видеофайл:</label>
        <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} required />
        <label>Превью (необязательно):</label>
        <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files[0])} />
        <button type="submit" disabled={loading}>
          {loading ? 'Загружается...' : 'Загрузить'}
        </button>
      </form>
    </div>
  );
}