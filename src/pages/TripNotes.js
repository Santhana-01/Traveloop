import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notesApi } from '../api/client';
import Header from '../components/Header';
import '../styles/TripNotes.css';

function TripNotes() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general'
  });

  const categories = ['general', 'reminder', 'expense', 'memory', 'idea'];

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const loadNotes = async () => {
    try {
      const response = await notesApi.getNotes(tripId);
      if (response.success) {
        setNotes(response.notes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddNote = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setMessage('Please fill in all fields');
      return;
    }

    try {
      const response = await notesApi.createNote(tripId, formData);
      if (response.success) {
        setNotes([response.note, ...notes]);
        setFormData({ title: '', content: '', category: 'general' });
        setShowForm(false);
        setMessage('Note added successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error adding note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;

    try {
      const response = await notesApi.deleteNote(tripId, noteId);
      if (response.success) {
        setNotes(notes.filter(n => n._id !== noteId));
      }
    } catch (err) {
      setMessage('Error deleting note');
    }
  };

  const handleTogglePin = async (noteId) => {
    try {
      const response = await notesApi.togglePin(tripId, noteId);
      if (response.success) {
        setNotes(
          notes.map(n =>
            n._id === noteId ? { ...n, pinned: !n.pinned } : n
          )
        );
      }
    } catch (err) {
      setMessage('Error updating note');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: '#667eea',
      reminder: '#ff6b6b',
      expense: '#51cf66',
      memory: '#fcc419',
      idea: '#9775fa'
    };
    return colors[category] || colors.general;
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      general: '📝',
      reminder: '⏰',
      expense: '💰',
      memory: '✨',
      idea: '💡'
    };
    return emojis[category] || '📝';
  };

  const pinnedNotes = notes.filter(n => n.pinned);
  const unpinnedNotes = notes.filter(n => !n.pinned);

  return (
    <>
      <Header 
        title={`Trip Notes`}
        showBackButton
        onBack={() => navigate(`/trip/${tripId}`)}
      />
      <div className="notes-container">
        {message && <div className="success-message">{message}</div>}

        {/* Add Note Button */}
        {!showForm && (
          <button 
            className="btn-add-note"
            onClick={() => setShowForm(true)}
          >
            <span>✏️ Add Note</span>
          </button>
        )}

        {/* Add Note Form */}
        {showForm && (
          <div className="note-form-card">
            <h3>Create New Note</h3>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Note title..."
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {getCategoryEmoji(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your note here..."
                rows="6"
              />
            </div>

            <div className="form-actions">
              <button className="btn-primary" onClick={handleAddNote}>
                Save Note
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ title: '', content: '', category: 'general' });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <div className="notes-section">
            <h3>📌 Pinned Notes</h3>
            <div className="notes-grid">
              {pinnedNotes.map(note => (
                <div
                  key={note._id}
                  className="note-card pinned"
                  style={{ borderTopColor: getCategoryColor(note.category) }}
                >
                  <div className="note-header">
                    <div>
                      <div className="note-category">
                        {getCategoryEmoji(note.category)} {note.category}
                      </div>
                      <h4>{note.title}</h4>
                    </div>
                    <button
                      className="btn-pin"
                      onClick={() => handleTogglePin(note._id)}
                      title="Unpin"
                    >
                      📌
                    </button>
                  </div>
                  <p className="note-content">{note.content}</p>
                  <div className="note-date">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteNote(note._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Notes */}
        {unpinnedNotes.length > 0 && (
          <div className="notes-section">
            <h3>📋 All Notes</h3>
            <div className="notes-grid">
              {unpinnedNotes.map(note => (
                <div
                  key={note._id}
                  className="note-card"
                  style={{ borderTopColor: getCategoryColor(note.category) }}
                >
                  <div className="note-header">
                    <div>
                      <div className="note-category">
                        {getCategoryEmoji(note.category)} {note.category}
                      </div>
                      <h4>{note.title}</h4>
                    </div>
                    <button
                      className="btn-pin"
                      onClick={() => handleTogglePin(note._id)}
                      title="Pin"
                    >
                      📍
                    </button>
                  </div>
                  <p className="note-content">{note.content}</p>
                  <div className="note-date">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteNote(note._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {notes.length === 0 && !showForm && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No notes yet</h3>
            <p>Add notes to document your trip memories and important details.</p>
          </div>
        )}

        {loading && <div className="loading">Loading notes...</div>}
      </div>
    </>
  );
}

export default TripNotes;
