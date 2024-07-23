export const AUTH = {
  patternPassword:
    '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$',

  validationField: {
    email: {
      required: 'Email is required',
      email: 'Not a valid email',
    },
    password: {
      required: 'Password is required',
      pattern:
        '8 characters, uppercase, lowercase, number, and special character',
    },
    confirmPassword: {
      required: 'Confirm Password is required',
      mismatch: 'Passwords do not match',
    },
    firstname: { required: 'First Name is required' },
    lastname: { required: 'Last Name is required' },
    otp: {
      required: 'OTP is required',
      minlength: 'OTP must be at least 8',
      maxlength: 'OTP must be at most 8',
    },
  },
};
