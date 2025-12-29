// Math page - Quick Problem Solver
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
  Collapse,
  Chip
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  History as HistoryIcon,
  Clear as ClearIcon,
  ContentCopy as ContentCopyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Functions as FunctionsIcon,
  SmartToy as SmartToyIcon
} from '@mui/icons-material';
import {
  solveExpression,
  getStepBySolution,
  setExpression,
  clearResult,
  toggleSteps,
  clearHistory
} from '../store/slices/mathSlice';
import { mathApi } from '../api/mathApi';
import { showToast } from '../utils/toast';
import PageHeader from '../components/PageHeader';

const Math = () => {
  const dispatch = useDispatch();
  const {
    currentExpression,
    currentResult,
    currentSteps,
    calculationHistory,
    loading,
    error,
    showSteps
  } = useSelector((state) => state.math);

  const [activeTab, setActiveTab] = useState(0);
  const [inputExpression, setInputExpression] = useState('');

  useEffect(() => {
    setInputExpression(currentExpression);
  }, [currentExpression]);

  const handleSolve = async (withSteps = false) => {
    if (!inputExpression.trim()) {
      showToast.error('Please enter a mathematical expression');
      return;
    }

    if (!mathApi.validateExpression(inputExpression)) {
      showToast.error('Invalid mathematical expression');
      return;
    }

    dispatch(setExpression(inputExpression));

    try {
      if (withSteps) {
        await dispatch(getStepBySolution(inputExpression)).unwrap();
      } else {
        await dispatch(solveExpression(inputExpression)).unwrap();
      }
    } catch (error) {
      showToast.error(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        handleSolve(true); // Shift+Enter for step-by-step
      } else {
        handleSolve(); // Enter for quick solve
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast.success('Copied to clipboard');
    }).catch(() => {
      showToast.error('Failed to copy');
    });
  };

  const insertFunction = (func) => {
    const cursorPos = document.getElementById('math-input')?.selectionStart || inputExpression.length;
    const newExpression = 
      inputExpression.slice(0, cursorPos) + func + inputExpression.slice(cursorPos);
    setInputExpression(newExpression);
  };

  const quickButtons = [
    { label: '+', value: '+' },
    { label: '−', value: '-' },
    { label: '×', value: '*' },
    { label: '÷', value: '/' },
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: '^', value: '**' },
    { label: '√', value: 'sqrt(' },
    { label: 'π', value: '3.14159' },
    { label: 'Clear', value: 'clear', action: () => setInputExpression('') }
  ];

  const exampleExpressions = [
    '2 + 3 * 4',
    '(15 + 25) / 2',
    '2**3 + 4**2',
    '100 - 25 * 2',
    '(8 + 2) * (5 - 3)',
    '50 / (2 + 3)'
  ];

  const renderResult = () => {
    if (!currentResult && currentResult !== 0) return null;

    return (
      <Card sx={{ mb: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#06b6d4' }}>
              Result
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Copy result">
                <IconButton
                  onClick={() => copyToClipboard(currentResult.toString())}
                  sx={{ color: '#06b6d4' }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              {currentSteps && (
                <Tooltip title={showSteps ? "Hide steps" : "Show steps"}>
                  <IconButton
                    onClick={() => dispatch(toggleSteps())}
                    sx={{ color: '#06b6d4' }}
                  >
                    {showSteps ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              Expression:
            </Typography>
            <Typography variant="h6" sx={{ color: 'white', fontFamily: 'monospace' }}>
              {currentExpression}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              Answer:
            </Typography>
            <Typography variant="h4" sx={{ color: '#06b6d4', fontWeight: 700, fontFamily: 'monospace' }}>
              {mathApi.formatResult(currentResult)}
            </Typography>
          </Box>

          {currentSteps && (
            <Collapse in={showSteps}>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ color: '#667eea', mb: 2 }}>
                  Step-by-Step Solution:
                </Typography>
                {Array.isArray(currentSteps) ? (
                  <List>
                    {currentSteps.map((step, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={`Step ${index + 1}: ${step}`}
                          sx={{
                            '& .MuiListItemText-primary': {
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontFamily: 'monospace'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic' }}>
                    {currentSteps || 'Step-by-step solution not available for this expression.'}
                  </Typography>
                )}
              </Box>
            </Collapse>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderHistory = () => (
    <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#06b6d4' }}>
            Calculation History
          </Typography>
          {calculationHistory.length > 0 && (
            <Button
              startIcon={<ClearIcon />}
              onClick={() => dispatch(clearHistory())}
              size="small"
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Clear
            </Button>
          )}
        </Box>
        
        {calculationHistory.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            No calculation history yet
          </Typography>
        ) : (
          <List>
            {calculationHistory.slice(0, 20).map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setInputExpression(item.expression);
                    dispatch(setExpression(item.expression));
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ color: 'white', fontFamily: 'monospace' }}>
                          {item.expression}
                        </Typography>
                        <Typography sx={{ color: '#06b6d4', fontFamily: 'monospace', fontWeight: 600 }}>
                          = {mathApi.formatResult(item.result)}
                        </Typography>
                      </Box>
                    }
                    secondary={new Date(item.timestamp).toLocaleString()}
                    sx={{
                      '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.5)' }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <PageHeader
        title="Math Solver"
        subtitle="Quick calculations and problem solving with step-by-step solutions"
        icon={<CalculateIcon />}
      />

      {/* Input Section */}
      <Card sx={{ mb: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField
              id="math-input"
              fullWidth
              placeholder="Enter mathematical expression (e.g., 2 + 3 * 4)"
              value={inputExpression}
              onChange={(e) => setInputExpression(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  fontFamily: 'monospace',
                  fontSize: '1.1rem',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: '#06b6d4' },
                  '&.Mui-focused fieldset': { borderColor: '#06b6d4' }
                },
                '& .MuiInputBase-input': { color: 'white' }
              }}
            />
            <Button
              variant="contained"
              onClick={() => handleSolve()}
              disabled={loading || !inputExpression.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <CalculateIcon />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minWidth: 120
              }}
            >
              Solve
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleSolve(true)}
              disabled={loading || !inputExpression.trim()}
              startIcon={<SmartToyIcon />}
              sx={{
                borderColor: '#06b6d4',
                color: '#06b6d4',
                '&:hover': {
                  borderColor: '#0891b2',
                  backgroundColor: 'rgba(6, 182, 212, 0.1)'
                }
              }}
            >
              Steps
            </Button>
          </Box>

          {/* Quick Input Buttons */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {quickButtons.map((button) => (
              <Button
                key={button.label}
                size="small"
                onClick={button.action || (() => insertFunction(button.value))}
                sx={{
                  minWidth: 40,
                  backgroundColor: button.label === 'Clear' 
                    ? 'rgba(239, 68, 68, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: button.label === 'Clear' ? '#ef4444' : 'white',
                  '&:hover': {
                    backgroundColor: button.label === 'Clear' 
                      ? 'rgba(239, 68, 68, 0.3)' 
                      : 'rgba(255, 255, 255, 0.2)'
                  }
                }}
              >
                {button.label}
              </Button>
            ))}
          </Box>

          {/* Example Expressions */}
          <Box>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              Try these examples:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {exampleExpressions.map((expr, index) => (
                <Chip
                  key={index}
                  label={expr}
                  onClick={() => setInputExpression(expr)}
                  sx={{
                    backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    color: '#06b6d4',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    '&:hover': {
                      backgroundColor: 'rgba(6, 182, 212, 0.3)'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 2, display: 'block' }}>
            Press Enter to solve quickly, or Shift+Enter for step-by-step solution
          </Typography>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Result Section */}
        <Box sx={{ flex: 2 }}>
          {renderResult()}
        </Box>

        {/* Sidebar */}
        <Box sx={{ flex: 1 }}>
          {renderHistory()}
        </Box>
      </Box>
    </Container>
  );
};

export default Math;