const zod = require("zod");
const regexPassword = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
);

const updateAvatar = zod.object({
  body: zod.object({
    avatar: zod
      .string({ required_error: "Avatar is required" })
      .min(1, { message: "Avatar is required" }),
  }),
});

const updateProfile = zod.object({
  body: zod.object({
    firstname: zod
      .string({ required_error: "First name is required" })
      .min(1, { message: "First name is required" }),
    lastname: zod
      .string({ required_error: "Last name is required" })
      .min(1, { message: "Last name is required" }),
    remark: zod.string().optional().nullable(),
  }),
});

const changesPassword = zod.object({
  body: zod
    .object({
      oldPassword: zod
        .string({ required_error: "Old password is required" })
        .min(1, { message: "Old password is required" }),
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
  updateProfile,
  updateAvatar,
  changesPassword,
};
