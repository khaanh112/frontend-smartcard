import * as yup from 'yup';

// Personal Info Step Validation
export const personalInfoSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  
  title: yup
    .string()
    .required('Title/Position is required')
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must not exceed 100 characters'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .lowercase(),
  
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^[\d\s+()-]+$/,
      'Please enter a valid phone number'
    )
    .min(10, 'Phone number must be at least 10 digits'),
  
  address: yup
    .string()
    .max(200, 'Address must not exceed 200 characters'),
});

// Work Experience Validation
export const workExperienceSchema = yup.object().shape({
  company: yup
    .string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters'),
  
  position: yup
    .string()
    .required('Position is required')
    .min(2, 'Position must be at least 2 characters')
    .max(100, 'Position must not exceed 100 characters'),
  
  startDate: yup
    .string()
    .required('Start date is required'),
  
  endDate: yup
    .string()
    .nullable()
    .when(['isCurrent', 'startDate'], {
      is: (isCurrent, startDate) => !isCurrent && startDate,
      then: (schema) => schema.required('End date is required'),
      otherwise: (schema) => schema.notRequired()
    }),
  
  description: yup
    .string()
    .max(500, 'Description must not exceed 500 characters'),
  
  isCurrent: yup.boolean(),
});

// Social Link Validation
export const socialLinkSchema = yup.object().shape({
  platform: yup
    .string()
    .required('Platform is required')
    .oneOf(
      ['facebook', 'linkedin', 'twitter', 'instagram', 'github', 'youtube', 'tiktok', 'website', 'email', 'phone', 'zalo', 'telegram'],
      'Please select a valid platform'
    ),
  
  url: yup
    .string()
    .required('URL/Contact is required')
    .test('platform-validation', 'Invalid format for selected platform', function(value) {
      const { platform } = this.parent;
      if (!value || !platform) return true;
      
      const platformValidation = {
        facebook: /facebook\.com/i,
        linkedin: /linkedin\.com/i,
        twitter: /(twitter\.com|x\.com)/i,
        instagram: /instagram\.com/i,
        github: /github\.com/i,
        youtube: /youtube\.com/i,
        tiktok: /tiktok\.com/i,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s+()-]+$/,
        website: /^https?:\/\/.+/,
      };
      
      // Only validate if platform has specific pattern
      if (platformValidation[platform]) {
        return platformValidation[platform].test(value);
      }
      
      return true; // No specific validation for zalo, telegram
    }),
});

// Platform-specific URL validation
export const validatePlatformUrl = (platform, url) => {
  const platformPatterns = {
    LINKEDIN: /linkedin\.com/i,
    FACEBOOK: /facebook\.com/i,
    INSTAGRAM: /instagram\.com/i,
    TWITTER: /(twitter\.com|x\.com)/i,
    GITHUB: /github\.com/i,
  };

  if (platformPatterns[platform]) {
    return platformPatterns[platform].test(url);
  }
  
  return true; // No specific validation for other platforms
};
