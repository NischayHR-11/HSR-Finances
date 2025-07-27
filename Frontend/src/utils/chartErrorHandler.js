// Chart Error Handler - Suppress known Nivo SVG transform errors in production

const suppressChartErrors = () => {
  if (import.meta.env.PROD) {
    // Store original console.error
    const originalError = console.error;
    
    // Override console.error to filter out specific SVG transform errors
    console.error = (...args) => {
      const message = args[0];
      
      // Check if it's an SVG transform error from Nivo charts
      if (typeof message === 'string' && (
        message.includes('transform: Expected') ||
        message.includes('translate(') ||
        (message.includes('<g> attribute transform') && message.includes('Expected'))
      )) {
        // Silently ignore these errors in production
        return;
      }
      
      // For all other errors, use the original console.error
      originalError.apply(console, args);
    };
    
    console.log('Chart error suppression enabled for production');
  }
};

// Auto-execute when imported
suppressChartErrors();

export default suppressChartErrors;
