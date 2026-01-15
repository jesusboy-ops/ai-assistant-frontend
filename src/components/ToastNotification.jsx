// Toast notification component using MUI Snackbar
import { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import toast from '../utils/toast';

const ToastNotification = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  useEffect(() => {
    const unsubscribe = toast.subscribe(({ message, type }) => {
      setMessage(message);
      setSeverity(type);
      setOpen(true);
    });

    return unsubscribe;
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;
