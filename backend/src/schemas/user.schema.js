const zod = require("zod");
const regexId = new RegExp(/^[0-9]\d*$/);

const findUserById = zod.object({
  params: zod.object({
    id: zod
      .string({ required_error: "ID is required" })
      .regex(regexId, { message: "ID is required" }),
  }),
});

const updateProfile = zod.object({
  params: zod.object({
    id: zod
      .string({ required_error: "ID is required" })
      .regex(regexId, { message: "ID is required" }),
  }),
  body: zod.object({
    firstname: zod
      .string({ required_error: "First name is required" })
      .min(1, { message: "First name is required" }),
    lastname: zod
      .string({ required_error: "Last name is required" })
      .min(1, { message: "Last name is required" }),
    active: zod.boolean({ required_error: "Active is required" }),
    remark: zod.string().optional().nullable(),
  }),
});

const updateRoles = zod.object({
  params: zod.object({
    id: zod
      .string({ required_error: "ID is required" })
      .regex(regexId, { message: "ID is required" }),
  }),
  body: zod.object({
    Roles: zod
      .array(zod.string({ required_error: "Roles is required" }))
      .min(1, { message: "Roles is required" })
      .nonempty({ message: "Roles is required" }),
  }),
});

const deleteUser = zod.object({
  params: zod.object({
    id: zod
      .string({ required_error: "ID is required" })
      .regex(regexId, { message: "ID is required" }),
  }),
});

module.exports = {
  findUserById,
  updateProfile,
  updateRoles,
  deleteUser,
};
