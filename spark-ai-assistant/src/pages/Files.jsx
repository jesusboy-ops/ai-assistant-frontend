// Files page
import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  LinearProgress,
  alpha
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { addFile, deleteFile } from '../store/slices/filesSlice';
import { formatSmartDate } from '../utils/formatDate';
import toast from '../utils/toast';
import PageHeader from '../components/PageHeader';

const Files = () => {
  const dispatch = useDispatch();
  const { files } = useSelector((state) => state.files);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    selectedFiles.forEach((file) => {
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      };
      dispatch(addFile(newFile));
    });
    
    toast.success(`${selectedFiles.length} file(s) uploaded`);
  };

  const handleDelete = (fileId) => {
    dispatch(deleteFile(fileId));
    toast.success('File deleted');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
      <PageHeader
        title="Files"
        subtitle="Upload and manage your files"
        action={
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadIcon />}
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
            Upload Files
            <input
              type="file"
              hidden
              multiple
              onChange={handleFileUpload}
            />
          </Button>
        }
      />

      {/* Drag and Drop Area */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
        <Paper
          sx={{
            padding: 6,
            width: '100%',
            maxWidth: 600,
            border: '2px dashed',
            borderColor: alpha('#667eea', 0.5),
            background: `linear-gradient(135deg, ${alpha('#667eea', 0.05)} 0%, ${alpha('#764ba2', 0.05)} 100%)`,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
            borderRadius: 3,
            '&:hover': {
              borderColor: '#06b6d4',
              background: `linear-gradient(135deg, ${alpha('#06b6d4', 0.08)} 0%, ${alpha('#3b82f6', 0.08)} 100%)`,
              transform: 'translateY(-2px)'
              }
          }}
          component="label"
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha('#667eea', 0.2)} 0%, ${alpha('#764ba2', 0.2)} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem'
            }}
          >
            <UploadIcon sx={{ fontSize: 40, color: '#667eea' }} />
          </Box>
          <Typography variant="h6" sx={{ marginBottom: 1, fontWeight: 600 }}>
            Drag and drop files here
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to browse from your computer
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', marginTop: 1 }}>
            Supports all file types • Max 10MB per file
          </Typography>
          <input
            type="file"
            hidden
            multiple
            onChange={handleFileUpload}
          />
        </Paper>
      </Box>

      {/* Files List */}
      <Card
        sx={{
          background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          borderRadius: 3
          }}
      >
        <CardContent sx={{ padding: 0 }}>
          {files.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                padding: 8,
                color: 'text.secondary'
              }}
            >
              <FileIcon sx={{ fontSize: 64, marginBottom: 2, opacity: 0.3 }} />
              <Typography variant="h6" sx={{ marginBottom: 1 }}>
                No files uploaded yet
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Upload your first file to get started
              </Typography>
            </Box>
          ) : (
            <List sx={{ padding: 0 }}>
              {files.map((file) => (
                <ListItem
                  key={file.id}
                  secondaryAction={
                    <Box>
                      <IconButton edge="end" sx={{ marginRight: 1 }}>
                        <DownloadIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDelete(file.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                  sx={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:last-child': {
                      borderBottom: 'none'
                    }
                  }}
                >
                  <ListItemIcon>
                    <FileIcon sx={{ color: '#667eea' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={`${formatFileSize(file.size)} • ${formatSmartDate(file.uploadedAt)}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Files;