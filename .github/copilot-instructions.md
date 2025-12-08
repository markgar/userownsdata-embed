# Copilot Instructions

## Error Logging

This project has a centralized logging system. **All logging (client and server) flows through `/api/log`** so that changing the logging implementation in one place affects the entire system.

### How to use the logger (Client-side)

The `logger` object is available globally in the browser (defined in `/public/js/logger.js`). It sends logs to the server endpoint `POST /api/log`, which outputs them to the server console.

```javascript
// Instead of console.log
logger.log('Message here', { optional: 'data' });

// Instead of console.warn
logger.warn('Warning message', { optional: 'data' });

// Instead of console.error
logger.error('Error message', { error: err.message, stack: err.stack });
```

### Server-side logging

For consistency, use the same logging pattern on the server side with `console.log`, `console.warn`, and `console.error`:

```javascript
// Info logging
console.log(`[${new Date().toISOString()}] [SERVER] Message here`, { optional: 'data' });

// Warning logging
console.warn(`[${new Date().toISOString()}] [SERVER WARN] Warning message`, { optional: 'data' });

// Error logging
console.error(`[${new Date().toISOString()}] [SERVER ERROR] Error message`, { error: err.message, stack: err.stack });
```

### Server output format

Logs appear in the server terminal with timestamps and level indicators:

```
[2025-12-05T15:04:03.643Z] [CLIENT] Message here { optional: 'data' }
[2025-12-05T15:04:03.648Z] [CLIENT WARN] Warning message { optional: 'data' }
[2025-12-05T15:04:03.655Z] [CLIENT ERROR] Error message { error: '...', stack: '...' }
[2025-12-05T15:04:03.700Z] [SERVER] Server-side message { optional: 'data' }
```

### Automatic error capture

The logger automatically captures:
- Unhandled JavaScript errors (`window.onerror`)
- Unhandled promise rejections (`window.onunhandledrejection`)

### When to use

Always use `logger` instead of `console` when:
- Debugging issues that need to be visible in the server terminal
- Adding diagnostic logging to client-side code
- Tracking errors in the Power BI embedding flow
