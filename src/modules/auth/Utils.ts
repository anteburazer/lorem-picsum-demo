const passwordRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&$/()=?*+,._-])(?=.{8,})',
);

export const validationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  },
  passwordRequired: {
    required: 'Password is required'
  },
  passwordFormat: {
    pattern: {
      value: passwordRegex,
      message:
        'Password must be at least 8 characters long, contain lowercase, uppercase, number and a symbol',
    },
  },
};