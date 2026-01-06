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
  Tooltip,
  IconButton,
  Collapse,
  Chip
} from '@mui/material';
import LoadingSpinner from '../components/LoadingSpinner';
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
    { label: 'sin', value: 'sin(' },
    { label: 'cos', value: 'cos(' },
    { label: 'tan', value: 'tan(' },
    { label: 'log', value: 'log(' },
    { label: 'ln', value: 'ln(' },
    { label: 'e', value: '2.71828' },
    { label: 'π', value: '3.14159' },
    { label: 'Clear', value: 'clear', action: () => setInputExpression('') }
  ];

  const exampleExpressions = [
    // Basic arithmetic
    '2 + 3 * 4',
    '(15 + 25) / 2',
    '100 - 25 * 2',
    
    // Powers and roots
    '2**8',
    '3**4 + 2**5',
    'sqrt(144)',
    'sqrt(25) + sqrt(16)',
    
    // Exponentials and logarithms
    '2.71828**3',
    'log(100)',
    'ln(2.71828)',
    
    // Trigonometry
    'sin(3.14159/2)',
    'cos(0)',
    'tan(3.14159/4)',
    
    // Complex expressions
    '(2**3 + sqrt(16)) * (log(100) - 1)',
    'sin(3.14159/6) + cos(3.14159/3)',
    '2.71828**(ln(5)) + sqrt(2**4)',
    
    // Advanced problems
    '(3**4 - 2**5) / (sqrt(49) + 1)',
    'log(1000) * ln(2.71828**2)',
    'sin(3.14159/2)**2 + cos(3.14159/2)**2'
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
                <Typography variant="h6" sx={{ color: '#667eea', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SmartToyIcon />
                  Detailed Step-by-Step Solution:
                </Typography>
                {Array.isArray(currentSteps) ? (
                  <Box sx={{ 
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    borderRadius: 2,
                    p: 3,
                    border: '1px solid rgba(102, 126, 234, 0.3)'
                  }}>
                    {currentSteps.map((step, index) => (
                      <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < currentSteps.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Chip 
                            label={`Step ${index + 1}`} 
                            size="small" 
                            sx={{ 
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              fontWeight: 600
                            }} 
                          />
                          {index === currentSteps.length - 1 && (
                            <Chip 
                              label="Final Answer" 
                              size="small" 
                              sx={{ 
                                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                                color: 'white',
                                fontWeight: 600
                              }} 
                            />
                          )}
                        </Box>
                        <Typography sx={{ 
                          color: 'rgba(255, 255, 255, 0.95)', 
                          fontFamily: 'monospace',
                          fontSize: '1.1rem',
                          lineHeight: 1.6,
                          background: 'rgba(0, 0, 0, 0.3)',
                          p: 2,
                          borderRadius: 1,
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          {step}
                        </Typography>
                        {index < currentSteps.length - 1 && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                            <ExpandMoreIcon sx={{ color: '#667eea' }} />
                          </Box>
                        )}
                      </Box>
                    ))}
                    
                    <Box sx={{ 
                      mt: 3, 
                      p: 2, 
                      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(8, 145, 178, 0.2) 100%)',
                      borderRadius: 2,
                      border: '1px solid rgba(6, 182, 212, 0.4)'
                    }}>
                      <Typography variant="h6" sx={{ color: '#06b6d4', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalculateIcon />
                        Final Result:
                      </Typography>
                      <Typography variant="h4" sx={{ 
                        color: '#06b6d4', 
                        fontWeight: 700, 
                        fontFamily: 'monospace',
                        textAlign: 'center'
                      }}>
                        {mathApi.formatResult(currentResult)}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ 
                    p: 3,
                    background: 'rgba(255, 193, 7, 0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 193, 7, 0.3)'
                  }}>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      fontStyle: 'italic',
                      textAlign: 'center'
                    }}>
                      {currentSteps || 'This expression was solved directly. For more complex problems, try expressions with multiple operations, functions, or parentheses to see detailed steps.'}
                    </Typography>
                  </Box>
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
              placeholder="Enter mathematical expression (e.g., 2**8, sqrt(144), sin(π/2), log(100), ln(e**3))"
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
              startIcon={loading ? <LoadingSpinner size={20} type="modern" /> : <CalculateIcon />}
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
              💡 Try these examples (from basic to advanced):
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {exampleExpressions.map((expr, index) => (
                <Chip
                  key={index}
                  label={expr}
                  onClick={() => setInputExpression(expr)}
                  size="small"
                  sx={{
                    backgroundColor: index < 3 ? 'rgba(76, 175, 80, 0.2)' : 
                                     index < 7 ? 'rgba(255, 193, 7, 0.2)' :
                                     index < 13 ? 'rgba(255, 152, 0, 0.2)' :
                                     'rgba(244, 67, 54, 0.2)',
                    color: index < 3 ? '#4caf50' : 
                           index < 7 ? '#ffc107' :
                           index < 13 ? '#ff9800' :
                           '#f44336',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    '&:hover': {
                      backgroundColor: index < 3 ? 'rgba(76, 175, 80, 0.3)' : 
                                       index < 7 ? 'rgba(255, 193, 7, 0.3)' :
                                       index < 13 ? 'rgba(255, 152, 0, 0.3)' :
                                       'rgba(244, 67, 54, 0.3)',
                      transform: 'scale(1.05)'
                    }
                  }}
                />
              ))}
            </Box>
            <Box sx={{ mt: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ color: '#4caf50' }}>🟢 Basic</Typography>
              <Typography variant="caption" sx={{ color: '#ffc107' }}>🟡 Powers & Roots</Typography>
              <Typography variant="caption" sx={{ color: '#ff9800' }}>🟠 Functions</Typography>
              <Typography variant="caption" sx={{ color: '#f44336' }}>🔴 Advanced</Typography>
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