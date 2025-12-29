// Notes page
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  PushPin as PinIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PushPinOutlined as PinOutlinedIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotes, createNote, updateNote, deleteNote, togglePinNote } from '../store/slices/notesSlice';
import { formatSmartDate } from '../utils/formatDate';
import toast from '../utils/toast';
import PageHeader from '../components/PageHeader';
import NoteShareDialog from '../components/NoteShareDialog';

const Notes = () => {
  const dispatch = useDispatch();
  const { notes: rawNotes } = useSelector((state) => state.notes);
  
  // Ensure notes is always an array to prevent filter errors
  const notes = Array.isArray(rawNotes) ? rawNotes : [];
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [noteToShare, setNoteToShare] = useState(null);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleOpenDialog = (note = null) => {
    if (note) {
      setCurrentNote(note);
      setFormData({ title: note.title, content: note.content });
    } else {
      setCurrentNote(null);
      setFormData({ title: '', content: '' });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentNote(null);
    setFormData({ title: '', content: '' });
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (currentNote) {
      dispatch(updateNote({ 
        id: currentNote.id, 
        updates: { ...formData, updatedAt: new Date().toISOString() }
      }));
      toast.success('Note updated');
    } else {
      const noteData = {
        ...formData,
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dispatch(createNote(noteData));
      toast.success('Note created');
    }
    handleCloseDialog();
  };

  const handleDelete = (noteId) => {
    dispatch(deleteNote(noteId));
    toast.success('Note deleted');
  };

  const handlePin = (noteId) => {
    dispatch(togglePinNote(noteId));
  };

  const handleShare = (note) => {
    setNoteToShare(note);
    setShareDialogOpen(true);
  };

  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
    setNoteToShare(null);
  };

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const regularNotes = notes.filter((n) => !n.isPinned);

  return (
    <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
      <PageHeader
        title="Notes"
        subtitle="Capture your thoughts and ideas"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              paddingX: 3,
              paddingY: 1.25,
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)'
                }
            }}
          >
            New Note
          </Button>
        }
      />

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 3 }}>
            <PinIcon sx={{ color: '#667eea' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Pinned Notes
            </Typography>
          </Box>
          <Grid container spacing={3} sx={{ marginBottom: 5 }}>
            {pinnedNotes.map((note) => (
              <Grid item xs={12} sm={6} lg={4} key={note.id}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(26, 26, 46, 0.9) 100%)',
                    border: '2px solid',
                    borderImageSource: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderImageSlice: 1,
                    borderRadius: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-6px)'
                      }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {note.title}
                      </Typography>
                      <IconButton size="small" onClick={() => handlePin(note.id)}>
                        <PinIcon sx={{ color: '#667eea' }} />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        marginBottom: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {note.content}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatSmartDate(note.updatedAt)}
                      </Typography>
                      <Box>
                        <IconButton size="small" onClick={() => handleShare(note)}>
                          <ShareIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleOpenDialog(note)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(note.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Regular Notes */}
      {regularNotes.length > 0 && (
        <>
          <Typography variant="h6" sx={{ marginBottom: 3, fontWeight: 600 }}>
            All Notes
          </Typography>
          <Grid container spacing={3}>
            {regularNotes.map((note) => (
              <Grid item xs={12} sm={6} lg={4} key={note.id}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      border: '1px solid #06b6d4'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {note.title}
                      </Typography>
                      <IconButton size="small" onClick={() => handlePin(note.id)}>
                        <PinIcon />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        marginBottom: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {note.content}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatSmartDate(note.updatedAt)}
                      </Typography>
                      <Box>
                        <IconButton size="small" onClick={() => handleShare(note)}>
                          <ShareIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleOpenDialog(note)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(note.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {notes.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            padding: 8,
            color: 'text.secondary'
          }}
        >
          <Typography variant="h6">No notes yet</Typography>
          <Typography variant="body2">Click "New Note" to create your first note</Typography>
        </Box>
      )}

      {/* Note Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{currentNote ? 'Edit Note' : 'New Note'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ marginTop: 1, marginBottom: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={10}
            label="Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Note Share Dialog */}
      <NoteShareDialog
        open={shareDialogOpen}
        onClose={handleCloseShareDialog}
        note={noteToShare}
      />
    </Box>
  );
};

export default Notes;
