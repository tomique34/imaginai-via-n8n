export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
}

export const validatePrompt = (prompt: string): ValidationResult => {
  const MAX_PROMPT_LENGTH = 2000;
  const MIN_PROMPT_LENGTH = 3;

  // Remove control characters
  const sanitized = prompt.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

  if (sanitized.trim().length < MIN_PROMPT_LENGTH) {
    return { valid: false, error: 'Prompt too short (minimum 3 characters)' };
  }

  if (sanitized.length > MAX_PROMPT_LENGTH) {
    return { valid: false, error: `Prompt too long (maximum ${MAX_PROMPT_LENGTH} characters)` };
  }

  // Check for suspicious patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /eval\(/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  if (dangerousPatterns.some(pattern => pattern.test(sanitized))) {
    return { valid: false, error: 'Invalid characters or patterns detected' };
  }

  return { valid: true, sanitized };
};

export const sanitizePrompt = (prompt: string): string => {
  // Remove control characters and trim
  return prompt.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
};
