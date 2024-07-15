const zod = require("zod");
const regexPassword = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
);

const register = zod.object({
  body: zod
    .object({
      email: zod
        .string({ required_error: "Email is required" })
        .email("Not a valid email"),
      password: zod
        .string({ required_error: "Password is required" })
        .min(1, { message: "Password is required" })
        .regex(regexPassword, {
          message:
            "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
        }),
      passwordConfirmation: zod.string({
        required_error: "Confirm Password is required",
      }),
      firstname: zod
        .string({ required_error: "First Name is required" })
        .min(1, { message: "First Name is required" }),
      lastname: zod
        .string({ required_error: "Last Name is required" })
        .min(1, { message: "Last Name is required" }),
      avatar: zod.string().optional().nullable(),
      remark: zod.string().optional().nullable(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwords do not match",
      path: ["passwordConfirmation"],
    }),
});

const verifyEmail = zod.object({
  params: zod.object({
    token: zod.string({ required_error: "Token is required" }),
  }),
});

const login = zod.object({
  body: zod.object({
    email: zod
      .string({ required_error: "Email is required" })
      .email("Not a valid email"),
    password: zod
      .string({ required_error: "Password is required" })
      .min(1, { message: "Password is required" }),
  }),
});

const forgotPassword = zod.object({
  body: zod.object({
    email: zod
      .string({ required_error: "Email is required" })
      .email("Not a valid email"),
  }),
});

const resetPassword = zod.object({
  body: zod
    .object({
      email: zod
        .string({ required_error: "Email is required" })
        .email("Not a valid email"),
      passwordResetCode: zod
        .string({ required_error: "Password reset code is required" })
        .length(8, {
          message: "Password reset code must be exactly 8 characters",
        }),
      newPassword: zod
        .string({ required_error: "New password is required" })
        .min(1, { message: "New password is required" })
        .regex(regexPassword, {
          message:
            "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
        }),
      newPasswordConfirmation: zod.string({
        required_error: "Confirm new password is required",
      }),
    })
    .refine((data) => data.newPassword === data.newPasswordConfirmation, {
      message: "Passwords do not match",
      path: ["newPasswordConfirmation"],
    }),
});

module.exports = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
};
