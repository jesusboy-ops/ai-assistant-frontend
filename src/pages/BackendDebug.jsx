// Backend Debug page for testing API connectivity
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  BugReport as DebugIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as RunIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { 
  testBackendEndpoints, 
  testTasksAPI, 
  testRemindersAPI, 
  testCalendarAPI, 
  runAllBackendTests 
} from '../utils/backendTest';

const BackendDebug = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const runTest = async (testFunction, testName) => {
    setLoading(true);
    setSelectedTest(testName);
    
    try {
      console.log(`🚀 Running ${testName} test...`);
      const result = await testFunction();
      setTestResults(prev => ({
        ...prev,
        [testName]: result
      }));
    } catch (error) {
      console.error(`❌ ${testName} test failed:`, error);
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: false,
          error: error.message,
          message: `${testName} test failed with error`
        }
      }));
    } finally {
      setLoading(false);
      setSelectedTest(null);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setSelectedTest('all');
    
    try {
      console.log('🚀 Running all backend tests...');
      const results = await runAllBackendTests();
      setTestResults(results);
    } catch (error) {
      console.error('❌ All tests failed:', error);
      setTestResults({
        error: error.message,
        message: 'All tests failed with error'
      });
    } finally {
      setLoading(false);
      setSelectedTest(null);
    }
  };

  const getStatusIcon = (result) => {
    if (!result) return <WarningIcon color="warning" />;
    if (result.success || result.summary?.isBackendAccessible) return <SuccessIcon color="success" />;
    return <ErrorIcon color="error" />;
  };

  const getStatusColor = (result) => {
    if (!result) return 'warning';
    if (result.success || result.summary?.isBackendAccessible) return 'success';
    return 'error';
  };

  const formatResult = (result) => {
    if (!result) return 'Not tested';
    if (typeof result === 'string') return result;
    return JSON.stringify(result, null, 2);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <DebugIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Backend Debug
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Test backend API connectivity and troubleshoot issues
          </Typography>
        </Box>
      </Box>

      {/* Test Controls */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={loading && selectedTest === 'endpoints' ? <CircularProgress size={16} /> : <RunIcon />}
            onClick={() => runTest(testBackendEndpoints, 'endpoints')}
            disabled={loading}
          >
            Test Endpoints
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={loading && selectedTest === 'tasks' ? <CircularProgress size={16} /> : <RunIcon />}
            onClick={() => runTest(testTasksAPI, 'tasks')}
            disabled={loading}
          >
            Test Tasks API
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={loading && selectedTest === 'reminders' ? <CircularProgress size={16} /> : <RunIcon />}
            onClick={() => runTest(testRemindersAPI, 'reminders')}
            disabled={loading}
          >
            Test Reminders API
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={loading && selectedTest === 'calendar' ? <CircularProgress size={16} /> : <RunIcon />}
            onClick={() => runTest(testCalendarAPI, 'calendar')}
            disabled={loading}
          >
            Test Calendar API
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={loading && selectedTest === 'all' ? <CircularProgress size={20} /> : <RunIcon />}
            onClick={runAllTests}
            disabled={loading}
          >
            Run All Tests
          </Button>
        </Grid>
      </Grid>

      {/* Loading Indicator */}
      {loading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={20} sx={{ mr: 2 }} />
            Running {selectedTest} test... Please wait.
          </Box>
        </Alert>
      )}

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Test Results
            </Typography>
            
            {/* General Endpoints Test */}
            {testResults.endpoints && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {getStatusIcon(testResults.endpoints)}
                    <Typography sx={{ ml: 1, flexGrow: 1 }}>
                      General Endpoints Test
                    </Typography>
                    <Chip
                      label={testResults.endpoints.summary?.isBackendAccessible ? 'Connected' : 'Failed'}
                      color={getStatusColor(testResults.endpoints)}
                      size="small"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                    {formatResult(testResults.endpoints)}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Tasks API Test */}
            {testResults.tasks && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {getStatusIcon(testResults.tasks)}
                    <Typography sx={{ ml: 1, flexGrow: 1 }}>
                      Tasks API Test
                    </Typography>
                    <Chip
                      label={testResults.tasks.success ? 'Success' : 'Failed'}
                      color={getStatusColor(testResults.tasks)}
                      size="small"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                    {formatResult(testResults.tasks)}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Reminders API Test */}
            {testResults.reminders && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {getStatusIcon(testResults.reminders)}
                    <Typography sx={{ ml: 1, flexGrow: 1 }}>
                      Reminders API Test
                    </Typography>
                    <Chip
                      label={testResults.reminders.success ? 'Success' : 'Failed'}
                      color={getStatusColor(testResults.reminders)}
                      size="small"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                    {formatResult(testResults.reminders)}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Calendar API Test */}
            {testResults.calendar && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {getStatusIcon(testResults.calendar)}
                    <Typography sx={{ ml: 1, flexGrow: 1 }}>
                      Calendar API Test
                    </Typography>
                    <Chip
                      label={testResults.calendar.success ? 'Success' : 'Failed'}
                      color={getStatusColor(testResults.calendar)}
                      size="small"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                    {formatResult(testResults.calendar)}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}

            {/* General Test Results */}
            {testResults.general && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {getStatusIcon(testResults.general)}
                    <Typography sx={{ ml: 1, flexGrow: 1 }}>
                      General Backend Test
                    </Typography>
                    <Chip
                      label={testResults.general.summary?.isBackendAccessible ? 'Connected' : 'Failed'}
                      color={getStatusColor(testResults.general)}
                      size="small"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                    {formatResult(testResults.general)}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            How to Use This Debug Tool
          </Typography>
          <Typography variant="body2" paragraph>
            1. <strong>Test Endpoints</strong>: Tests basic connectivity to various backend endpoints
          </Typography>
          <Typography variant="body2" paragraph>
            2. <strong>Test Individual APIs</strong>: Tests specific functionality for Tasks, Reminders, and Calendar
          </Typography>
          <Typography variant="body2" paragraph>
            3. <strong>Run All Tests</strong>: Comprehensive test of all backend functionality
          </Typography>
          <Typography variant="body2" paragraph>
            4. Check the browser console for detailed logs during testing
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Note:</strong> This tool will create and delete test data to verify API functionality.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BackendDebug;