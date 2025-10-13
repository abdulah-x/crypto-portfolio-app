// Industry-standard validation utilities for VaultX
// Following OWASP guidelines and best practices

export interface ValidationResult {
  isValid: boolean;
  message: string;
  strength?: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
}

// Common disposable email domains to block
const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.org',
  'temp-mail.org', 'throwaway.email', 'getnada.com', 'maildrop.cc',
  'sharklasers.com', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me'
];



// Common valid TLDs (Top Level Domains)
const VALID_TLDS = [
  'com', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'co', 'io', 'ai',
  'app', 'dev', 'tech', 'info', 'biz', 'name', 'pro', 'me', 'tv',
  // Country codes
  'us', 'uk', 'ca', 'au', 'de', 'fr', 'it', 'es', 'nl', 'be', 'ch',
  'at', 'se', 'no', 'dk', 'fi', 'pl', 'cz', 'hu', 'ro', 'bg', 'hr',
  'si', 'sk', 'lt', 'lv', 'ee', 'ie', 'pt', 'gr', 'cy', 'mt', 'lu'
];

// Suspicious domain patterns that might indicate spam or invalid domains
const SUSPICIOUS_DOMAIN_PATTERNS = [
  /^\d+\.(com|org|net|edu)$/, // Only numbers before common TLDs (like 11.com, 123.org)
  /^[a-z]{1,2}\.(com|org|net)$/, // Very short domains (like ab.com, x.com - with exceptions)
  /^(test|temp|fake|spam|dummy|example)\./, // Test/fake domains
  /\d{5,}/, // Very long sequences of numbers (5+ digits)
  /^[0-9-]+\.(com|org|net)$/, // Only numbers and hyphens
];

/**
 * Validates email address following RFC 5322 standards with additional security checks
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: 'Email address is required' };
  }

  // Basic format validation (more comprehensive than simple regex)
  const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  // Length validation
  if (email.length > 254) {
    return { isValid: false, message: 'Email address is too long' };
  }

  // Local part validation (before @)
  const [localPart, domain] = email.split('@');
  
  if (localPart.length > 64) {
    return { isValid: false, message: 'Email local part is too long' };
  }

  // Check for consecutive dots
  if (localPart.includes('..') || domain.includes('..')) {
    return { isValid: false, message: 'Email cannot contain consecutive dots' };
  }

  // Enhanced domain validation
  if (domain.length < 4 || domain.length > 253) {
    return { isValid: false, message: 'Invalid email domain' };
  }

  // Split domain into parts
  const domainParts = domain.toLowerCase().split('.');
  
  // Domain must have at least 2 parts (e.g., example.com)
  if (domainParts.length < 2) {
    return { isValid: false, message: 'Email domain must have a valid format' };
  }

  // Validate each domain part
  for (const part of domainParts) {
    if (part.length === 0) {
      return { isValid: false, message: 'Invalid email domain format' };
    }
    
    // Domain parts cannot be only numbers (like "11")
    if (/^\d+$/.test(part)) {
      return { isValid: false, message: 'Email domain cannot contain numeric-only segments' };
    }
    
    // Domain parts must start and end with alphanumeric
    if (!/^[a-zA-Z0-9]/.test(part) || !/[a-zA-Z0-9]$/.test(part)) {
      return { isValid: false, message: 'Invalid email domain format' };
    }
  }

  // Validate TLD (Top Level Domain) - last part
  const tld = domainParts[domainParts.length - 1];
  
  // TLD must be at least 2 characters and contain only letters
  if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
    return { isValid: false, message: 'Email domain must have a valid top-level domain' };
  }

  // TLD cannot be only numbers
  if (/^\d+$/.test(tld)) {
    return { isValid: false, message: 'Top-level domain cannot be numeric' };
  }

  // Domain name (second-to-last part) validation for common issues
  if (domainParts.length >= 2) {
    const domainName = domainParts[domainParts.length - 2];
    
    // Domain name should be at least 2 characters
    if (domainName.length < 2) {
      return { isValid: false, message: 'Email domain name is too short' };
    }
    
    // Domain name cannot be only numbers
    if (/^\d+$/.test(domainName)) {
      return { isValid: false, message: 'Email domain name cannot be numeric only' };
    }
    
    // Domain name should contain at least one letter
    if (!/[a-zA-Z]/.test(domainName)) {
      return { isValid: false, message: 'Email domain name must contain letters' };
    }
  }

  // Check against disposable email providers
  const domainLower = domain.toLowerCase();
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domainLower)) {
    return { isValid: false, message: 'Disposable email addresses are not allowed' };
  }

  // Check for suspicious domain patterns
  for (const pattern of SUSPICIOUS_DOMAIN_PATTERNS) {
    if (pattern.test(domainLower)) {
      return { isValid: false, message: 'Please enter a valid email domain' };
    }
  }

  // Validate TLD against known good TLDs for additional security
  const tldLower = tld.toLowerCase();
  if (!VALID_TLDS.includes(tldLower)) {
    // Allow some flexibility for new or less common TLDs, but warn about very suspicious ones
    if (tld.length < 2 || /^\d+$/.test(tld)) {
      return { isValid: false, message: 'Please enter a valid top-level domain' };
    }
    // For uncommon TLDs, we'll allow them but could add a warning in the future
  }

  // Check for suspicious patterns in local part
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return { isValid: false, message: 'Invalid email format' };
  }

  // Check for overly simple or suspicious local parts
  if (localPart.length < 2) {
    return { isValid: false, message: 'Email address is too short' };
  }

  // Block obviously fake patterns
  if (/^(test|fake|spam|dummy|admin|root|noreply)$/i.test(localPart)) {
    return { isValid: false, message: 'Please enter a valid personal email address' };
  }

  return { isValid: true, message: 'Valid email address' };
};

/**
 * Validates password strength following OWASP guidelines
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Password is required', strength: 'weak' };
  }

  // Minimum length check
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long', strength: 'weak' };
  }

  // Maximum length check (to prevent DoS attacks)
  if (password.length > 128) {
    return { isValid: false, message: 'Password is too long (maximum 128 characters)', strength: 'weak' };
  }

  let score = 0;
  const feedback: string[] = [];

  // Character type requirements
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);

  if (!hasLowerCase) feedback.push('lowercase letter');
  if (!hasUpperCase) feedback.push('uppercase letter');
  if (!hasNumbers) feedback.push('number');
  if (!hasSpecialChars) feedback.push('special character');

  // Basic requirements
  if (hasLowerCase) score++;
  if (hasUpperCase) score++;
  if (hasNumbers) score++;
  if (hasSpecialChars) score++;

  // Length bonus
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // Pattern checks
  const hasSequentialChars = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789|890)/i.test(password);
  const hasRepeatingChars = /(.)\1{2,}/.test(password);
  const hasKeyboardPatterns = /(qwerty|asdf|zxcv|1234|abcd)/i.test(password);

  if (hasSequentialChars) {
    score--;
    feedback.push('Avoid sequential characters (abc, 123)');
  }

  if (hasRepeatingChars) {
    score--;
    feedback.push('Avoid repeating characters (aaa, 111)');
  }

  if (hasKeyboardPatterns) {
    score--;
    feedback.push('Avoid keyboard patterns (qwerty, asdf)');
  }

  // Common password checks
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
    'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'password1'
  ];

  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    return { isValid: false, message: 'Password contains common words or patterns', strength: 'weak' };
  }

  // Determine strength and validation result
  let strength: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  let isValid = true;
  let message = '';

  if (score < 2) {
    strength = 'weak';
    isValid = false;
    message = `Password is too weak. Must include: ${feedback.join(', ')}`;
  } else if (score < 4) {
    strength = 'fair';
    isValid = false;
    message = `Password needs improvement. Missing: ${feedback.join(', ')}`;
  } else if (score < 5) {
    strength = 'good';
    message = 'Good password strength';
  } else if (score < 6) {
    strength = 'strong';
    message = 'Strong password';
  } else {
    strength = 'very-strong';
    message = 'Very strong password';
  }

  // Minimum requirements for acceptance
  if (feedback.length > 1) {
    isValid = false;
    message = `Password must contain at least: ${feedback.slice(0, 2).join(' and ')}`;
  }

  return { isValid, message, strength };
};

/**
 * Validates name fields (first name, last name)
 */
export const validateName = (name: string, fieldName: string): ValidationResult => {
  if (!name || !name.trim()) {
    return { isValid: false, message: `${fieldName} is required` };
  }

  const trimmedName = name.trim();

  // Length validation
  if (trimmedName.length < 2) {
    return { isValid: false, message: `${fieldName} must be at least 2 characters` };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, message: `${fieldName} is too long (maximum 50 characters)` };
  }

  // Character validation - only letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }

  // Check for suspicious patterns
  if (trimmedName.includes('  ')) {
    return { isValid: false, message: `${fieldName} cannot contain multiple consecutive spaces` };
  }

  if (trimmedName.startsWith(' ') || trimmedName.endsWith(' ')) {
    return { isValid: false, message: `${fieldName} cannot start or end with spaces` };
  }

  // Check for numbers or special characters that might indicate spam
  if (/\d/.test(trimmedName) || /[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?`~]/.test(trimmedName)) {
    return { isValid: false, message: `${fieldName} cannot contain numbers or special characters` };
  }

  return { isValid: true, message: `Valid ${fieldName.toLowerCase()}` };
};

/**
 * Validates password confirmation
 */
export const validatePasswordConfirmation = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }

  return { isValid: true, message: 'Passwords match' };
};

/**
 * Real-time password strength indicator
 */
export const getPasswordStrengthColor = (strength?: string): string => {
  switch (strength) {
    case 'weak': return 'text-red-400';
    case 'fair': return 'text-orange-400';
    case 'good': return 'text-yellow-400';
    case 'strong': return 'text-green-400';
    case 'very-strong': return 'text-emerald-400';
    default: return 'text-slate-400';
  }
};

/**
 * Get password strength bar width
 */
export const getPasswordStrengthWidth = (strength?: string): string => {
  switch (strength) {
    case 'weak': return 'w-1/5';
    case 'fair': return 'w-2/5';
    case 'good': return 'w-3/5';
    case 'strong': return 'w-4/5';
    case 'very-strong': return 'w-full';
    default: return 'w-0';
  }
};

/**
 * Comprehensive form validation for signup
 */
export const validateSignupForm = (formData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}, agreedToTerms: boolean): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  // Validate first name
  const firstNameResult = validateName(formData.firstName, 'First name');
  if (!firstNameResult.isValid) {
    errors.firstName = firstNameResult.message;
  }

  // Validate last name
  const lastNameResult = validateName(formData.lastName, 'Last name');
  if (!lastNameResult.isValid) {
    errors.lastName = lastNameResult.message;
  }

  // Validate email
  const emailResult = validateEmail(formData.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.message;
  }

  // Validate password
  const passwordResult = validatePassword(formData.password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.message;
  }

  // Validate password confirmation
  const confirmPasswordResult = validatePasswordConfirmation(formData.password, formData.confirmPassword);
  if (!confirmPasswordResult.isValid) {
    errors.confirmPassword = confirmPasswordResult.message;
  }

  // Validate terms agreement
  if (!agreedToTerms) {
    errors.terms = 'You must agree to the Terms of Service and Privacy Policy';
  }

  return errors;
};

/**
 * Comprehensive form validation for login
 */
export const validateLoginForm = (formData: {
  email: string;
  password: string;
}): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  // Validate email
  const emailResult = validateEmail(formData.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.message;
  }

  // For login, we don't need strict password validation
  // Just check if password is provided
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 1) {
    errors.password = 'Password cannot be empty';
  }

  return errors;
};