import React from 'react';
import { Box, Typography, IconButton, useTheme, useMediaQuery, Portal } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const SlidingPanel = ({
  open,
  onClose,
  title,
  children,
  width = '450px',
  anchor = 'right'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Always full width on mobile
  const panelWidth = isMobile ? '100%' : width;

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const panelVariants = {
    hidden: { 
      [anchor === 'right' ? 'x' : anchor === 'left' ? 'x' : anchor === 'bottom' ? 'y' : 'y']: anchor === 'right' ? '100%' : anchor === 'left' ? '-100%' : anchor === 'bottom' ? '100%' : '-100%',
      opacity: 0.5 
    },
    visible: { 
      x: 0, 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200
      }
    },
    exit: { 
      [anchor === 'right' ? 'x' : anchor === 'left' ? 'x' : anchor === 'bottom' ? 'y' : 'y']: anchor === 'right' ? '100%' : anchor === 'left' ? '-100%' : anchor === 'bottom' ? '100%' : '-100%',
      opacity: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200
      }
    }
  };

  // Determine positional styles based on anchor
  const getAnchorStyles = () => {
    switch (anchor) {
      case 'right': return { top: 0, right: 0, bottom: 0, width: panelWidth, borderLeft: `1px solid ${theme.palette.divider}` };
      case 'left': return { top: 0, left: 0, bottom: 0, width: panelWidth, borderRight: `1px solid ${theme.palette.divider}` };
      case 'bottom': return { bottom: 0, left: 0, right: 0, height: panelWidth, borderTop: `1px solid ${theme.palette.divider}` };
      case 'top': return { top: 0, left: 0, right: 0, height: panelWidth, borderBottom: `1px solid ${theme.palette.divider}` };
      default: return { top: 0, right: 0, bottom: 0, width: panelWidth, borderLeft: `1px solid ${theme.palette.divider}` };
    }
  };

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: theme.zIndex.drawer + 2,
              display: 'flex',
              pointerEvents: 'none'
            }}
          >
            {/* Backdrop */}
            <Box
              component={motion.div}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                pointerEvents: 'auto'
              }}
            />

            {/* Panel */}
            <Box
              component={motion.div}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              sx={{
                position: 'absolute',
                ...getAnchorStyles(),
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[8],
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: 'auto',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 3,
                  py: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  backgroundColor: 'rgba(255, 255, 255, 0.02)'
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  {title}
                </Typography>
                <IconButton onClick={onClose} size="small" edge="end">
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
                {children}
              </Box>
            </Box>
          </Box>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default SlidingPanel;
