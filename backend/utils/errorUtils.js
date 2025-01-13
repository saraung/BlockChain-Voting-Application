// errorUtils.js
// utils/errorUtils.js
 // utils/errorUtils.js
 // utils/errorUtils.js
 function extractRevertReason(error) {
    let currentError = error;
  
    while (currentError) {
      // Check the error message for the "revert" pattern
      if (currentError.message) {
        const match = currentError.message.match(/revert (.+)/);
        if (match) {
          return match[1]; // Return the revert reason if found
        }
      }
  
      // Check if the error has a cause (sometimes the revert is nested)
      if (currentError.cause && currentError.cause.message) {
        const match = currentError.cause.message.match(/revert (.+)/);
        if (match) {
          return match[1];
        }
      }
  
      // Check if the error has a data object with a revert message (Web3 specific)
      if (currentError.data && currentError.data.message) {
        const match = currentError.data.message.match(/revert (.+)/);
        if (match) {
          return match[1];
        }
      }
  
      // Move to the nested error cause (if any)
      currentError = currentError.cause;
    }
  
    return null; // Return null if no revert reason is found
  }
  
  
  
  
  export { extractRevertReason }; // Named export
  