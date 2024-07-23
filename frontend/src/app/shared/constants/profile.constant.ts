export const PROFILE = {
  patternPassword:
    '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$',

  validationField: {
    email: {
      required: 'Email is required',
      email: 'Not a valid email',
    },
    oldPassword: {
      required: 'Old Password is required',
    },
    newPassword: {
      required: 'New Password is required',
      pattern:
        '8 characters, uppercase, lowercase, number, and special character',
    },
    confirmPassword: {
      required: 'Confirm Password is required',
      mismatch: 'Passwords do not match',
    },
    firstname: { required: 'First Name is required' },
    lastname: { required: 'Last Name is required' },
  },
};
