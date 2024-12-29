export const validateEmail = async (email) => {
    const API_KEY = 'c1e1a48eb7dc4f38931888980e9d5bda';
    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEY}&email=${encodeURIComponent(email)}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      return {
        isValid: data.is_valid_format?.value && data.deliverability === 'DELIVERABLE',
        score: data.quality_score
      };
    } catch (error) {
      throw new Error('Failed to validate email');
    }
  };