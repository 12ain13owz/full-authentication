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
      confirmPassword: zod.string({
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
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

const resendVerification = zod.object({
  body: zod.object({
    email: zod
      .string({ required_error: "Email is required" })
      .email("Not a valid email"),
  }),
});

const verifyEmail = zod.object({
  body: zod.object({
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
    token: zod.string({ required_error: "Token is required" }),
  }),
});

const logout = zod.object({
  body: zod.object({
    userId: zod.number().optional().nullable(),
  }),
});

const deleteDevice = zod.object({
  params: zod.object({
    refreshId: zod.string(),
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
      otp: zod.string({ required_error: "OTP code is required" }).length(8, {
        message: "OTP code must be exactly 8 characters",
      }),
      password: zod
        .string({ required_error: "password is required" })
        .min(1, { message: "password is required" })
        .regex(regexPassword, {
          message:
            "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
        }),
      confirmPassword: zod.string({
        required_error: "Confirm password is required",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

module.exports = {
  register,
  resendVerification,
  verifyEmail,
  login,
  logout,
  deleteDevice,
  forgotPassword,
  resetPassword,
};
