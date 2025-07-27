// Suppress WebSocket errors in production
if (import.meta.env.PROD) {
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('WebSocket connection')) {
      return; // Suppress WebSocket connection errors in production
    }
    originalError.apply(console, args);
  };
}
