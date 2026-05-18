import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notesApi } from '../api/client';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/TripNotes.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const noteVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 }
  },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
};

function TripNotes() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({ title: '', content: '', category: 'Other' });

  const categories = ['Memory', 'Todo', 'Expense', 'Idea', 'Warning', 'Other'];

  useEffect(() => {
    loadNotes();
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
    setFormData({ ...formData, [name]: value });
  };

  const [editingNoteId, setEditingNoteId] = useState(null);

  const handleAddNote = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setMessage('Please fill in all fields');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const newNote = {
      _id: editingNoteId || Date.now().toString(),
      ...formData,
      isPinned: false,
      createdAt: new Date().toISOString()
    };

    const previousNotes = [...notes];
    
    if (editingNoteId) {
      setNotes(notes.map(n => n._id === editingNoteId ? { ...n, ...formData } : n));
    } else {
      setNotes([newNote, ...notes]);
    }

    setFormData({ title: '', content: '', category: 'Other' });
    setShowForm(false);
    setEditingNoteId(null);

    try {
      let response;
      if (editingNoteId) {
        response = await notesApi.updateNote(editingNoteId, formData);
      } else {
        response = await notesApi.addNote(tripId, formData);
      }

      if (!response.success) throw new Error();
      
      if (editingNoteId) {
        setNotes(previousNotes.map(n => n._id === editingNoteId ? response.note : n));
      } else {
        setNotes(prev => [response.note, ...prev.filter(n => n._id !== newNote._id)]);
      }
    } catch (err) {
      setNotes(previousNotes);
      setMessage('Failed to save note. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const previousNotes = [...notes];
    setNotes(notes.filter(n => n._id !== noteId));
    try {
      const response = await notesApi.deleteNote(noteId);
      if (!response.success) {
        setNotes(previousNotes);
      }
    } catch (err) {
      setNotes(previousNotes);
      setMessage('Failed to delete note. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleTogglePin = async (noteId) => {
    const previousNotes = [...notes];
    const noteToPin = notes.find(n => n._id === noteId);
    if (!noteToPin) return;

    const updatedNote = { ...noteToPin, isPinned: !noteToPin.isPinned };
    setNotes(notes.map(n => n._id === noteId ? updatedNote : n).sort((a, b) => b.isPinned - a.isPinned));

    try {
      const response = await notesApi.togglePin(noteId);
      if (!response.success) {
        setNotes(previousNotes);
      } else {
        loadNotes();
      }
    } catch (err) {
      setNotes(previousNotes);
      setMessage('Failed to pin note. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note._id);
    setFormData({ title: note.title, content: note.content, category: note.category });
    setShowForm(true);
  };

  const getCategoryEmoji = (category) => {
    const emojis = { Memory: '✨', Todo: '✅', Expense: '💰', Idea: '💡', Warning: '⚠️', Other: '📝' };
    return emojis[category] || '📝';
  };

  const pinnedNotes = notes.filter(n => n.isPinned);
  const unpinnedNotes = notes.filter(n => !n.isPinned);

  return (
    <div className="aurora-page-wrapper">
      <div className="notes-container">
        
        <AnimatePresence>
          {message && (
            <motion.div className="message-banner" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="notes-actions">
          <motion.button 
            className="btn-add-note-main"
            onClick={() => setShowForm(!showForm)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {showForm ? 'Close Form' : '✏️ Add New Note'}
          </motion.button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div 
              className="note-form-card glass-panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Title..." />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  {categories.map(cat => <option key={cat} value={cat}>{getCategoryEmoji(cat)} {cat}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea name="content" value={formData.content} onChange={handleInputChange} placeholder="Write something..." rows="5" />
              </div>
              <motion.button className="btn-primary" onClick={handleAddNote} whileHover={{ scale: 1.02 }}>Save Note</motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="notes-sections-wrapper" variants={containerVariants} initial="hidden" animate="visible">
          {pinnedNotes.length > 0 && (
            <div className="notes-section">
              <h3 className="section-title">📌 Pinned</h3>
              <div className="notes-grid">
                <AnimatePresence mode="popLayout">
                  {pinnedNotes.map(note => (
                    <motion.div key={note._id} layout variants={noteVariants} initial="hidden" animate="visible" exit="exit" className="note-card pinned glass-panel">
                      <div className="note-header">
                        <span className="note-category">{getCategoryEmoji(note.category)} {note.category}</span>
                        <motion.button className="btn-pin active" onClick={() => handleTogglePin(note._id)} whileHover={{ scale: 1.2 }}>📌</motion.button>
                      </div>
                      <h4>{note.title}</h4>
                      <p>{note.content}</p>
                      <div className="note-footer">
                        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button className="btn-edit" style={{background:'none',border:'none',color:'#47B5FF',cursor:'pointer'}} onClick={() => handleEditNote(note)}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDeleteNote(note._id)}>Delete</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {unpinnedNotes.length > 0 && (
            <div className="notes-section">
              <h3 className="section-title">📋 All Notes</h3>
              <div className="notes-grid">
                <AnimatePresence mode="popLayout">
                  {unpinnedNotes.map(note => (
                    <motion.div key={note._id} layout variants={noteVariants} initial="hidden" animate="visible" exit="exit" className="note-card glass-panel">
                      <div className="note-header">
                        <span className="note-category">{getCategoryEmoji(note.category)} {note.category}</span>
                        <motion.button className="btn-pin" onClick={() => handleTogglePin(note._id)} whileHover={{ scale: 1.2 }}>📍</motion.button>
                      </div>
                      <h4>{note.title}</h4>
                      <p>{note.content}</p>
                      <div className="note-footer">
                        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button className="btn-edit" style={{background:'none',border:'none',color:'#47B5FF',cursor:'pointer'}} onClick={() => handleEditNote(note)}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDeleteNote(note._id)}>Delete</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>

        {notes.length === 0 && !showForm && (
          <motion.div className="empty-state glass-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="empty-icon">📝</div>
            <h3>No notes yet</h3>
            <p>Ready to jot down some ideas?</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default TripNotes;
