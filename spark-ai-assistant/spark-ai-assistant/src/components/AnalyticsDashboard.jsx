// Analytics Dashboard Component - Comprehensive productivity insights
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import LoadingSpinner from './LoadingSpinner';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  Task as TaskIcon,
  Event as EventIcon,
  Note as NoteIcon,
  Group as CollaborationIcon,
  Lightbulb as RecommendationIcon,
  Download as ExportIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { analyticsService } from '../services/analyticsService';
import { showToast } from '../utils/toast';

const AnalyticsDashboard = () => {
  // Redux state
  const { tasks } = useSelector(state => state.tasks);
  const { notes } = useSelector(state => state.notes);
  const { reminders } = useSelector(state => state.reminders);
  const { events } = useSelector(state => state.calendar);

  // Component state
  const [timeframe, setTimeframe] = useState('week');
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const [selectedMetrics, setSelectedMetrics] = useState([]);

  // Chart colors
  const colors = {
    primary: '#06b6d4',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  };

  useEffect(() => {
    generateInsights();
  }, [timeframe, tasks, notes, reminders, events]);

  // Generate analytics insights
  const generateInsights = async () => {
    setLoading(true);
    try {
      const analyticsData = analyticsService.generateProductivityInsights(
        tasks, events, notes, timeframe
      );
      setInsights(analyticsData);
    } catch (error) {
      console.error('Failed to generate insights:', error);
      showToast.error('Failed to generate analytics');
    } finally {
      setLoading(false);
    }
  };

  // Export analytics report
  const handleExport = async () => {
    try {
      const report = analyticsService.exportReport(insights, exportFormat);
      
      const blob = new Blob([report], { 
        type: exportFormat === 'json' ? 'application/json' : 'text/plain' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `productivity-report-${timeframe}-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportDialogOpen(false);
      showToast.success('Report exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      showToast.error('Failed to export report');
    }
  };

  // Render overview cards
  const renderOverviewCards = () => {
    if (!insights) return null;

    const { overview } = insights;
    
    const cards = [
      {
        title: 'Tasks Completed',
        value: overview.completedTasks,
        total: overview.totalTasks,
        percentage: overview.completionRate,
        icon: <TaskIcon />,
        color: colors.success,
        trend: '+12%'
      },
      {
        title: 'Productivity Score',
        value: overview.productivityScore,
        total: 100,
        percentage: overview.productivityScore,
        icon: <AssessmentIcon />,
        color: colors.primary,
        trend: '+5%'
      },
      {
        title: 'Meetings',
        value: overview.totalMeetings,
        total: null,
        percentage: null,
        icon: <EventIcon />,
        color: colors.warning,
        trend: '-8%'
      },
      {
        title: 'Notes Created',
        value: overview.totalNotes,
        total: null,
        percentage: null,
        icon: <NoteIcon />,
        color: colors.info,
        trend: '+15%'
      }
    ];

    return (
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                  <Chip 
                    label={card.trend}
                    size="small"
                    color={card.trend.startsWith('+') ? 'success' : 'error'}
                  />
                </Box>
                
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {card.value}
                  {card.total && <Typography component="span" variant="h6" color="text.secondary">/{card.total}</Typography>}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {card.title}
                </Typography>
                
                {card.percentage !== null && (
                  <LinearProgress 
                    variant="determinate" 
                    value={card.percentage} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: card.color
                      }
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Render task analytics chart
  const renderTaskAnalytics = () => {
    if (!insights?.taskAnalytics) return null;

    const { priorityBreakdown, categoryBreakdown } = insights.taskAnalytics;

    // Prepare priority data
    const priorityData = Object.entries(priorityBreakdown).map(([priority, data]) => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      completed: data.completed,
      total: data.total,
      pending: data.total - data.completed,
      completionRate: data.total > 0 ? (data.completed / data.total * 100).toFixed(1) : 0
    }));

    // Prepare category data for pie chart
    const categoryData = Object.entries(categoryBreakdown).map(([category, data]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: data.completed,
      total: data.total
    }));

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Completion by Priority
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" />
                  <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                  <ChartTooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="completed" fill={colors.success} name="Completed" />
                  <Bar dataKey="pending" fill={colors.warning} name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Distribution by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(colors)[index % Object.values(colors).length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // Render productivity patterns
  const renderProductivityPatterns = () => {
    if (!insights?.productivityPatterns) return null;

    const { hourlyProductivity, dailyPattern, weeklyPattern } = insights.productivityPatterns;

    // Prepare hourly data
    const hourlyData = Object.entries(hourlyProductivity).map(([hour, data]) => ({
      hour: `${hour}:00`,
      tasks: data.tasks,
      avgDuration: data.tasks > 0 ? Math.round(data.totalDuration / data.tasks) : 0
    })).filter(item => item.tasks > 0);

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Productivity Patterns
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Hourly Task Completion
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="hour" stroke="rgba(255, 255, 255, 0.7)" />
                <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                <ChartTooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="tasks" 
                  stroke={colors.primary} 
                  fill={colors.primary}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Peak Productivity Hours
              </Typography>
              <List dense>
                {insights.timeAnalytics.peakHours.map((hour, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <ScheduleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`${hour.hour}:00`}
                      secondary={`${hour.tasks} tasks completed`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Consistency Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LoadingSpinner 
                  size={60}
                  type="modern"
                  color="#10b981"
                />
                <Typography variant="h6">
                  {insights.productivityPatterns.consistencyScore}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Render recommendations
  const renderRecommendations = () => {
    if (!insights?.recommendations) return null;

    const { recommendations } = insights;

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RecommendationIcon />
            AI Recommendations
          </Typography>
          
          <List>
            {recommendations.slice(0, 5).map((rec, index) => (
              <ListItem key={index} divider={index < recommendations.length - 1}>
                <ListItemIcon>
                  {rec.priority >= 8 ? <WarningIcon color="error" /> :
                   rec.priority >= 6 ? <InfoIcon sx={{ color: '#f59e0b' }} /> :
                   <SuccessIcon sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />}
                </ListItemIcon>
                <ListItemText 
                  primary={rec.message}
                  secondary={`Priority: ${rec.priority}/10 | Impact: ${rec.impact}/10`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  // Render calendar insights
  const renderCalendarInsights = () => {
    if (!insights?.calendarInsights) return null;

    const { calendarInsights } = insights;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Meeting Efficiency
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Average Meeting Duration
                </Typography>
                <Typography variant="h4" color="primary">
                  {calendarInsights.avgMeetingDuration} min
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Calendar Utilization
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={calendarInsights.calendarUtilization} 
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="body2">
                  {calendarInsights.calendarUtilization}%
                </Typography>
              </Box>

              {calendarInsights.conflicts > 0 && (
                <Chip 
                  label={`${calendarInsights.conflicts} conflicts detected`}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#f59e0b'
                  }}
                  size="small"
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Focus Time Analysis
              </Typography>
              
              <List dense>
                {calendarInsights.focusBlocks?.slice(0, 3).map((block, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={`${block.duration} min focus block`}
                      secondary={`${block.start} - ${block.end}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // Render export dialog
  const renderExportDialog = () => (
    <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
      <DialogTitle>Export Analytics Report</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, minWidth: 300 }}>
          <FormControl fullWidth>
            <InputLabel>Format</InputLabel>
            <Select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              label="Format"
            >
              <MenuItem value="json">JSON</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="markdown">Markdown</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleExport} variant="contained">Export</Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <LoadingSpinner size={40} type="modern" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Analytics Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              label="Timeframe"
            >
              <MenuItem value="day">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Refresh Data">
            <IconButton onClick={generateInsights}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Button
            startIcon={<ExportIcon />}
            onClick={() => setExportDialogOpen(true)}
            variant="outlined"
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Overview Cards */}
      <Box sx={{ mb: 4 }}>
        {renderOverviewCards()}
      </Box>

      {/* Task Analytics */}
      <Box sx={{ mb: 4 }}>
        {renderTaskAnalytics()}
      </Box>

      {/* Productivity Patterns */}
      <Box sx={{ mb: 4 }}>
        {renderProductivityPatterns()}
      </Box>

      {/* Calendar Insights */}
      <Box sx={{ mb: 4 }}>
        {renderCalendarInsights()}
      </Box>

      {/* Recommendations */}
      <Box sx={{ mb: 4 }}>
        {renderRecommendations()}
      </Box>

      {/* Export Dialog */}
      {renderExportDialog()}
    </Box>
  );
};

export default AnalyticsDashboard;