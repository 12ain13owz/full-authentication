const { omit } = require("lodash");
const userService = require("../services/user.service");
const {
  newError,
  comparePasswords,
  hashPassowrd,
  privateUserFields,
} = require("../utils/helper");

const getProfile = async (req, res, next) => {
  res.locals.func = "Controller > Profile > getProfile";

  try {
    const profile = omit(res.locals.user, privateUserFields);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  res.locals.func = "Controller > Profile > updateProfile";

  try {
    const id = res.locals.userId;
    const { firstname, lastname, remark } = req.body;
    const body = { firstname, lastname, remark };

    const [updatedRowsCount] = await userService.update(id, body);
    if (updatedRowsCount === 0)
      throw newError(404, "User not found or no changes applied");

    res.json({ message: "Profile update successfully", user: { id, ...body } });
  } catch (error) {
    next(error);
  }
};

const uploadImage = async (req, res, next) => {
  res.locals.func = "Controller > Profile > uploadImage";

  try {
    if (!req.file || !req.processedImage)
      throw newError(400, "No file uploaded or processing failed");

    res.json({ avatar: req.processedImage });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  res.locals.func = "Controller > Profile > updateAvatar";

  try {
    const id = res.locals.userId;
    const body = { avatar: req.body.avatar };

    const [updatedRowsCount] = await userService.update(id, body);
    if (updatedRowsCount === 0)
      throw newError(404, "User not found or no changes avatar");

    res.json({ message: "Avatar update successfully" });
  } catch (error) {
    next(error);
  }
};

const changesPassword = async (req, res, next) => {
  res.locals.func = "Controller > Profile > changesPassword";

  try {
    const { id, password } = res.locals.user;
    const { oldPassword, newPassword } = req.body;

    const compare = comparePasswords(oldPassword, password);
    if (!compare) throw newError(401, "Incorrect old password");

    const body = { password: hashPassowrd(newPassword) };
    const [updatedRowsCount] = await userService.update(id, body);
    if (updatedRowsCount === 0)
      throw newError(404, "User not found or can not changes password");

    res.json({ message: "Password update successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadImage,
  updateAvatar,
  changesPassword,
};
