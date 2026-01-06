// PDF Scanner page with preview functionality
import { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  alpha
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  PictureAsPdf as PdfIcon,
  Visibility as PreviewIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Upload as ScanIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';

const PdfScanner = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    pdfFiles.forEach(file => {
      const fileData = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        uploadDate: new Date(),
        file: file,
        url: URL.createObjectURL(file)
      };
      
      setUploadedFiles(prev => [...prev, fileData]);
    });
    
    // Reset input
    event.target.value = '';
  };

  const handlePreview = (fileData) => {
    setPreviewFile(fileData);
    setPreviewOpen(true);
    setZoom(1);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewFile(null);
    setZoom(1);
  };

  const handleDelete = (fileId) => {
    setUploadedFiles(prev => {
      const fileToDelete = prev.find(f => f.id === fileId);
      if (fileToDelete) {
        URL.revokeObjectURL(fileToDelete.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleDownload = (fileData) => {
    const link = document.createElement('a');
    link.href = fileData.url;
    link.download = fileData.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ 
      maxWidth: 1400, 
      margin: '0 auto',
      padding: { xs: 1, sm: 2, md: 0 }
    }}>
      <PageHeader
        title="PDF Scanner & Viewer"
        subtitle="Upload, preview, and manage your PDF documents"
      />

      <Grid container spacing={3}>
        {/* Upload Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: 3
            }}
          >
            <CardContent sx={{ padding: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 3 }}>
                <ScanIcon sx={{ color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Upload PDF Files
                </Typography>
              </Box>

              {/* Upload Area */}
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: '2px dashed rgba(102, 126, 234, 0.5)',
                  borderRadius: 3,
                  padding: 6,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: alpha('#667eea', 0.05),
                  '&:hover': {
                    borderColor: '#667eea',
                    background: alpha('#667eea', 0.1),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <UploadIcon sx={{ fontSize: 48, color: '#667eea', marginBottom: 2 }} />
                <Typography variant="h6" sx={{ marginBottom: 1, fontWeight: 600 }}>
                  Drop PDF files here
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  or click to browse files
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', marginTop: 2, color: 'rgba(255, 255, 255, 0.5)' }}>
                  Supports PDF files up to 10MB
                </Typography>
              </Box>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              <Button
                fullWidth
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  marginTop: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)'
                    }
                }}
              >
                Select PDF Files
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* File List */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: 3
            }}
          >
            <CardContent sx={{ padding: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 3 }}>
                <PdfIcon sx={{ color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Uploaded Files ({uploadedFiles.length})
                </Typography>
              </Box>

              {uploadedFiles.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    padding: 6,
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}
                >
                  <PdfIcon sx={{ fontSize: 48, marginBottom: 2, opacity: 0.5 }} />
                  <Typography variant="body1">
                    No PDF files uploaded yet
                  </Typography>
                  <Typography variant="body2">
                    Upload some files to get started
                  </Typography>
                </Box>
              ) : (
                <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {uploadedFiles.map((file) => (
                    <ListItem
                      key={file.id}
                      sx={{
                        marginBottom: 2,
                        borderRadius: 2,
                        background: alpha('#667eea', 0.1),
                        border: `1px solid ${alpha('#667eea', 0.2)}`,
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        padding: 2,
                        gap: { xs: 2, sm: 0 }
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        flex: 1,
                        minWidth: 0,
                        gap: 2
                      }}>
                        <PdfIcon sx={{ color: '#ef4444', fontSize: 32, flexShrink: 0 }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 600, 
                              marginBottom: 0.5,
                              wordBreak: 'break-word',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: { xs: 'normal', sm: 'nowrap' }
                            }}
                          >
                            {file.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                              label={formatFileSize(file.size)}
                              size="small"
                              sx={{
                                backgroundColor: alpha('#667eea', 0.2),
                                color: '#667eea',
                                fontSize: '0.75rem'
                              }}
                            />
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {file.uploadDate.toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 1,
                        flexShrink: 0,
                        justifyContent: { xs: 'center', sm: 'flex-end' }
                      }}>
                        <IconButton
                          size="small"
                          onClick={() => handlePreview(file)}
                          sx={{
                            color: '#667eea',
                            '&:hover': { backgroundColor: alpha('#667eea', 0.1) }
                          }}
                        >
                          <PreviewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDownload(file)}
                          sx={{
                            color: '#10b981',
                            '&:hover': { backgroundColor: alpha('#667eea', 0.1) }
                          }}
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(file.id)}
                          sx={{
                            color: '#ef4444',
                            '&:hover': { backgroundColor: alpha('#ef4444', 0.1) }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* PDF Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: 3,
            minHeight: '80vh'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PdfIcon sx={{ color: '#ef4444' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {previewFile?.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
              sx={{ color: '#667eea' }}
            >
              <ZoomInIcon />
            </IconButton>
            <IconButton
              onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
              sx={{ color: '#667eea' }}
            >
              <ZoomOutIcon />
            </IconButton>
            <IconButton onClick={handleClosePreview} sx={{ color: '#ef4444' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ padding: 0, display: 'flex', justifyContent: 'center' }}>
          {previewFile && (
            <Box
              sx={{
                width: '100%',
                height: '70vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'auto',
                padding: 2
              }}
            >
              <iframe
                src={previewFile.url}
                style={{
                  width: `${100 * zoom}%`,
                  height: `${100 * zoom}%`,
                  border: 'none',
                  borderRadius: '8px'
                  }}
                title={previewFile.name}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button
            onClick={() => handleDownload(previewFile)}
            startIcon={<DownloadIcon />}
            sx={{ color: '#10b981' }}
          >
            Download
          </Button>
          <Button onClick={handleClosePreview} sx={{ color: '#667eea' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PdfScanner;