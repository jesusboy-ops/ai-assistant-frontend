// Math API for Quick Problem Solver - Frontend Only
// No external dependencies - pure JavaScript implementation

// Safe math evaluation using Function constructor (safer than eval)
const evaluateExpression = (expression) => {
  try {
    // Remove any non-mathematical characters for security
    const sanitized = expression
      .replace(/[^0-9+\-*/().\s]/g, '')
      .replace(/\s+/g, ''); // Remove spaces
    
    // Basic validation
    if (!sanitized || sanitized.trim() === '') {
      throw new Error('Empty expression');
    }

    // Check for balanced parentheses
    let balance = 0;
    for (let char of sanitized) {
      if (char === '(') balance++;
      if (char === ')') balance--;
      if (balance < 0) throw new Error('Unbalanced parentheses');
    }
    if (balance !== 0) throw new Error('Unbalanced parentheses');

    // Use Function constructor for safer evaluation
    const result = new Function('return ' + sanitized)();
    
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid result');
    }

    return result;
  } catch (error) {
    throw new Error('Invalid mathematical expression');
  }
};

// Generate simple steps for basic operations
const generateSteps = (expression, result) => {
  const steps = [];
  const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
  
  steps.push(`Expression: ${sanitized}`);
  
  // Identify operation types
  if (sanitized.includes('+')) {
    steps.push('Performing addition');
  }
  if (sanitized.includes('-')) {
    steps.push('Performing subtraction');
  }
  if (sanitized.includes('*')) {
    steps.push('Performing multiplication');
  }
  if (sanitized.includes('/')) {
    steps.push('Performing division');
  }
  if (sanitized.includes('(')) {
    steps.push('Evaluating parentheses first');
  }
  
  steps.push(`Result: ${result}`);
  
  return steps;
};

export const mathApi = {
  // Solve basic math expression
  solveExpression: async (expression) => {
    try {
      const result = evaluateExpression(expression);
      return {
        success: true,
        data: {
          expression,
          result,
          steps: null, // Basic evaluation doesn't provide steps
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to solve expression'
      };
    }
  },

  // Get step-by-step solution (Frontend fallback)
  getStepBySolution: async (expression) => {
    try {
      const result = evaluateExpression(expression);
      const steps = generateSteps(expression, result);
      
      return {
        success: true,
        data: {
          expression: expression.replace(/[^0-9+\-*/().\s]/g, ''),
          result,
          steps,
          explanation: 'Basic calculation completed (Advanced features require backend)'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to solve expression'
      };
    }
  },

  // Validate mathematical expression
  validateExpression: (expression) => {
    try {
      const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
      
      // Check for balanced parentheses
      let balance = 0;
      for (let char of sanitized) {
        if (char === '(') balance++;
        if (char === ')') balance--;
        if (balance < 0) return { valid: false, error: 'Unbalanced parentheses' };
      }
      
      if (balance !== 0) return { valid: false, error: 'Unbalanced parentheses' };
      if (sanitized.length === 0) return { valid: false, error: 'Empty expression' };
      
      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'Invalid expression' };
    }
  },

  // Format number result
  formatResult: (result) => {
    if (typeof result !== 'number') return result;
    
    // Handle very large or very small numbers
    if (Math.abs(result) > 1e10 || (Math.abs(result) < 1e-6 && result !== 0)) {
      return result.toExponential(6);
    }
    
    // Round to reasonable decimal places
    return Math.round(result * 1e10) / 1e10;
  },

  // Get basic examples
  getExamples: () => {
    return {
      basic: [
        '2 + 3',
        '10 - 4',
        '5 * 6',
        '20 / 4',
        '2 + 3 * 4',
        '(15 + 25) / 2',
        '100 - 25 * 2',
        '(10 + 5) * (8 - 3)'
      ],
      advanced: [
        'Note: Advanced functions like sin, cos, sqrt require backend integration',
        'Current version supports: +, -, *, /, ( )'
      ]
    };
  },

  // Get available operations
  getOperations: () => {
    return {
      supported: [
        'Addition (+)',
        'Subtraction (-)', 
        'Multiplication (*)',
        'Division (/)',
        'Parentheses ( )',
        'Decimal numbers'
      ],
      comingSoon: [
        'Square root (sqrt)',
        'Powers (^)',
        'Trigonometry (sin, cos, tan)',
        'Logarithms (log, ln)',
        'Advanced algebra'
      ]
    };
  }
};

export default mathApi;