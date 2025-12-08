// Client-side logger that sends logs to server
const logger = {
  async send(level, message, data) {
    // Log locally first
    const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    consoleMethod(`[${level.toUpperCase()}]`, message, data || '');
    
    // Send to server
    try {
      await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, message, data })
      });
    } catch (e) {
      // Ignore fetch errors to avoid infinite loops
    }
  },
  
  log(message, data) {
    this.send('info', message, data);
  },
  
  warn(message, data) {
    this.send('warn', message, data);
  },
  
  error(message, data) {
    this.send('error', message, data);
  }
};

// Capture unhandled errors
window.onerror = function(message, source, lineno, colno, error) {
  logger.error('Unhandled error: ' + message, { source, lineno, colno, stack: error?.stack });
  return false;
};

// Capture unhandled promise rejections
window.onunhandledrejection = function(event) {
  logger.error('Unhandled promise rejection', { reason: event.reason?.message || event.reason, stack: event.reason?.stack });
};
