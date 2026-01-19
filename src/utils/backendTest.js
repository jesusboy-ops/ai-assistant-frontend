// Backend connectivity test utility
import axiosInstance from '../api/axios';

export const testBackendEndpoints = async () => {
  console.log('🧪 Testing backend endpoints...');
  
  const endpoints = [
    { method: 'GET', url: '/', name: 'Root' },
    { method: 'GET', url: '/api', name: 'API Root' },
    { method: 'GET', url: '/api/health', name: 'Health Check' },
    { method: 'GET', url: '/api/tasks', name: 'Tasks List' },
    { method: 'GET', url: '/api/reminders', name: 'Reminders List' },
    { method: 'GET', url: '/api/calendar/events', name: 'Calendar Events' }
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`🔍 Testing ${endpoint.name}: ${endpoint.method} ${endpoint.url}`);
      
      const response = await axiosInstance({
        method: endpoint.method,
        url: endpoint.url,
        timeout: 10000 // 10 second timeout for tests
      });
      
      results.push({
        ...endpoint,
        status: 'success',
        statusCode: response.status,
        data: response.data,
        message: `✅ ${endpoint.name}: ${response.status}`
      });
      
      console.log(`✅ ${endpoint.name}: ${response.status}`, response.data);
      
    } catch (error) {
      const statusCode = error.response?.status || 'Network Error';
      const errorData = error.response?.data || error.message;
      
      results.push({
        ...endpoint,
        status: 'error',
        statusCode,
        error: errorData,
        message: `❌ ${endpoint.name}: ${statusCode}`
      });
      
      console.log(`❌ ${endpoint.name}: ${statusCode}`, errorData);
    }
  }
  
  // Summary
  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'error').length;
  
  console.log(`\n📊 Backend Test Summary:`);
  console.log(`✅ Successful: ${successful}/${endpoints.length}`);
  console.log(`❌ Failed: ${failed}/${endpoints.length}`);
  
  if (successful > 0) {
    console.log(`🎉 Backend is responding to ${successful} endpoint(s)`);
  } else {
    console.log(`🚨 Backend is not responding to any endpoints`);
  }
  
  return {
    results,
    summary: {
      total: endpoints.length,
      successful,
      failed,
      isBackendAccessible: successful > 0
    }
  };
};

export const testTasksAPI = async () => {
  console.log('🧪 Testing Tasks API specifically...');
  
  try {
    // Test GET /api/tasks
    console.log('🔍 Testing GET /api/tasks');
    const getResponse = await axiosInstance.get('/api/tasks');
    console.log('✅ GET /api/tasks successful:', getResponse.status, getResponse.data);
    
    // Test POST /api/tasks with minimal data
    console.log('🔍 Testing POST /api/tasks');
    const testTask = {
      title: 'Test Task from Frontend',
      description: 'This is a test task to verify API connectivity',
      priority: 'medium',
      status: 'pending'
    };
    
    const postResponse = await axiosInstance.post('/api/tasks', testTask);
    console.log('✅ POST /api/tasks successful:', postResponse.status, postResponse.data);
    
    // If creation was successful, try to delete the test task
    if (postResponse.data && postResponse.data.id) {
      try {
        console.log('🔍 Cleaning up test task:', postResponse.data.id);
        await axiosInstance.delete(`/api/tasks/${postResponse.data.id}`);
        console.log('✅ Test task cleaned up successfully');
      } catch (deleteError) {
        console.log('⚠️ Could not clean up test task:', deleteError.message);
      }
    }
    
    return {
      success: true,
      message: 'Tasks API is working correctly',
      details: {
        get: { status: getResponse.status, dataCount: Array.isArray(getResponse.data) ? getResponse.data.length : 'Not an array' },
        post: { status: postResponse.status, created: !!postResponse.data.id }
      }
    };
    
  } catch (error) {
    console.log('❌ Tasks API test failed:', error.response?.status, error.response?.data, error.message);
    return {
      success: false,
      error: error.response?.data || error.message,
      statusCode: error.response?.status,
      message: 'Tasks API is not working properly'
    };
  }
};

export const testRemindersAPI = async () => {
  console.log('🧪 Testing Reminders API specifically...');
  
  try {
    // Test GET /api/reminders
    console.log('🔍 Testing GET /api/reminders');
    const getResponse = await axiosInstance.get('/api/reminders');
    console.log('✅ GET /api/reminders successful:', getResponse.status, getResponse.data);
    
    // Test POST /api/reminders with minimal data
    console.log('🔍 Testing POST /api/reminders');
    const testReminder = {
      title: 'Test Reminder from Frontend',
      description: 'This is a test reminder to verify API connectivity',
      reminder_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      reminder_type: 'general',
      priority: 'medium'
    };
    
    const postResponse = await axiosInstance.post('/api/reminders', testReminder);
    console.log('✅ POST /api/reminders successful:', postResponse.status, postResponse.data);
    
    // If creation was successful, try to delete the test reminder
    if (postResponse.data && postResponse.data.id) {
      try {
        console.log('🔍 Cleaning up test reminder:', postResponse.data.id);
        await axiosInstance.delete(`/api/reminders/${postResponse.data.id}`);
        console.log('✅ Test reminder cleaned up successfully');
      } catch (deleteError) {
        console.log('⚠️ Could not clean up test reminder:', deleteError.message);
      }
    }
    
    return {
      success: true,
      message: 'Reminders API is working correctly',
      details: {
        get: { status: getResponse.status, dataCount: Array.isArray(getResponse.data) ? getResponse.data.length : 'Not an array' },
        post: { status: postResponse.status, created: !!postResponse.data.id }
      }
    };
    
  } catch (error) {
    console.log('❌ Reminders API test failed:', error.response?.status, error.response?.data, error.message);
    return {
      success: false,
      error: error.response?.data || error.message,
      statusCode: error.response?.status,
      message: 'Reminders API is not working properly'
    };
  }
};

export const testCalendarAPI = async () => {
  console.log('🧪 Testing Calendar API specifically...');
  
  try {
    // Test GET /api/calendar/events
    console.log('🔍 Testing GET /api/calendar/events');
    const getResponse = await axiosInstance.get('/api/calendar/events');
    console.log('✅ GET /api/calendar/events successful:', getResponse.status, getResponse.data);
    
    // Test POST /api/calendar/events with minimal data
    console.log('🔍 Testing POST /api/calendar/events');
    const testEvent = {
      title: 'Test Event from Frontend',
      description: 'This is a test event to verify API connectivity',
      date: new Date().toISOString().split('T')[0], // Today's date
      time: '14:00',
      duration: 60,
      color: '#667eea'
    };
    
    const postResponse = await axiosInstance.post('/api/calendar/events', testEvent);
    console.log('✅ POST /api/calendar/events successful:', postResponse.status, postResponse.data);
    
    // If creation was successful, try to delete the test event
    if (postResponse.data && postResponse.data.id) {
      try {
        console.log('🔍 Cleaning up test event:', postResponse.data.id);
        await axiosInstance.delete(`/api/calendar/events/${postResponse.data.id}`);
        console.log('✅ Test event cleaned up successfully');
      } catch (deleteError) {
        console.log('⚠️ Could not clean up test event:', deleteError.message);
      }
    }
    
    return {
      success: true,
      message: 'Calendar API is working correctly',
      details: {
        get: { status: getResponse.status, dataCount: Array.isArray(getResponse.data) ? getResponse.data.length : 'Not an array' },
        post: { status: postResponse.status, created: !!postResponse.data.id }
      }
    };
    
  } catch (error) {
    console.log('❌ Calendar API test failed:', error.response?.status, error.response?.data, error.message);
    return {
      success: false,
      error: error.response?.data || error.message,
      statusCode: error.response?.status,
      message: 'Calendar API is not working properly'
    };
  }
};

// Run all tests
export const runAllBackendTests = async () => {
  console.log('🚀 Running comprehensive backend tests...');
  
  const generalTest = await testBackendEndpoints();
  const tasksTest = await testTasksAPI();
  const remindersTest = await testRemindersAPI();
  const calendarTest = await testCalendarAPI();
  
  const allTests = {
    general: generalTest,
    tasks: tasksTest,
    reminders: remindersTest,
    calendar: calendarTest
  };
  
  console.log('\n📋 Complete Test Results:', allTests);
  
  return allTests;
};

export default {
  testBackendEndpoints,
  testTasksAPI,
  testRemindersAPI,
  testCalendarAPI,
  runAllBackendTests
};