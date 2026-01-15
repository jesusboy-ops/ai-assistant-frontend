// Math slice for Quick Problem Solver
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mathApi } from '../../api/mathApi';

// Async thunks
export const solveExpression = createAsyncThunk(
  'math/solveExpression',
  async (expression, { rejectWithValue }) => {
    const result = await mathApi.solveExpression(expression);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

export const getStepBySolution = createAsyncThunk(
  'math/getStepBySolution',
  async (expression, { rejectWithValue }) => {
    const result = await mathApi.getStepBySolution(expression);
    if (!result.success) {
      return rejectWithValue(result.error);
    }
    return result.data;
  }
);

const initialState = {
  currentExpression: '',
  currentResult: null,
  currentSteps: null,
  calculationHistory: JSON.parse(localStorage.getItem('math_history') || '[]'),
  loading: false,
  error: null,
  showSteps: false
};

const mathSlice = createSlice({
  name: 'math',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setExpression: (state, action) => {
      state.currentExpression = action.payload;
    },
    clearResult: (state) => {
      state.currentResult = null;
      state.currentSteps = null;
      state.currentExpression = '';
    },
    toggleSteps: (state) => {
      state.showSteps = !state.showSteps;
    },
    clearHistory: (state) => {
      state.calculationHistory = [];
      localStorage.removeItem('math_history');
    },
    addToHistory: (state, action) => {
      const { expression, result, steps } = action.payload;
      const historyItem = {
        expression,
        result,
        steps,
        timestamp: new Date().toISOString()
      };
      
      // Remove duplicates and add to beginning
      state.calculationHistory = state.calculationHistory.filter(
        item => item.expression !== expression
      );
      state.calculationHistory.unshift(historyItem);
      
      // Keep only last 50 calculations
      if (state.calculationHistory.length > 50) {
        state.calculationHistory = state.calculationHistory.slice(0, 50);
      }
      
      localStorage.setItem('math_history', JSON.stringify(state.calculationHistory));
    }
  },
  extraReducers: (builder) => {
    builder
      // Solve expression
      .addCase(solveExpression.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(solveExpression.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResult = action.payload.result;
        state.currentSteps = action.payload.steps;
        
        // Add to history
        const historyItem = {
          expression: action.payload.expression,
          result: action.payload.result,
          steps: action.payload.steps,
          timestamp: new Date().toISOString()
        };
        
        // Remove duplicates and add to beginning
        state.calculationHistory = state.calculationHistory.filter(
          item => item.expression !== action.payload.expression
        );
        state.calculationHistory.unshift(historyItem);
        
        // Keep only last 50 calculations
        if (state.calculationHistory.length > 50) {
          state.calculationHistory = state.calculationHistory.slice(0, 50);
        }
        
        localStorage.setItem('math_history', JSON.stringify(state.calculationHistory));
      })
      .addCase(solveExpression.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentResult = null;
        state.currentSteps = null;
      })
      
      // Get step-by-step solution
      .addCase(getStepBySolution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStepBySolution.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResult = action.payload.result;
        state.currentSteps = action.payload.steps;
        state.showSteps = true;
        
        // Add to history
        const historyItem = {
          expression: action.payload.expression,
          result: action.payload.result,
          steps: action.payload.steps,
          timestamp: new Date().toISOString()
        };
        
        // Remove duplicates and add to beginning
        state.calculationHistory = state.calculationHistory.filter(
          item => item.expression !== action.payload.expression
        );
        state.calculationHistory.unshift(historyItem);
        
        // Keep only last 50 calculations
        if (state.calculationHistory.length > 50) {
          state.calculationHistory = state.calculationHistory.slice(0, 50);
        }
        
        localStorage.setItem('math_history', JSON.stringify(state.calculationHistory));
      })
      .addCase(getStepBySolution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  setExpression,
  clearResult,
  toggleSteps,
  clearHistory,
  addToHistory
} = mathSlice.actions;

export default mathSlice.reducer;