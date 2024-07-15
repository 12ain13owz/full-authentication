const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = "./public";
    fs.mkdirSync(path, { recursive: true });

    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = null;
    if (!isValid)
      error = new Error("Invalid file type. Only images are allowed.");

    cb(error, path);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const process = async (req, res, next) => {
  res.locals.func = "Middleware > Upload > process";

  try {
    if (!req.file) next();
    const image = req.file.filename;
    const filepath = req.file.path;
    const outputPath = path.resolve(
      req.file.destination,
      image.split(".")[0] + ".webp"
    );

    await new Promise((resolve, reject) => {
      const transformer = sharp().webp({ quality: 90 }).on("error", reject);
      const readStream = fs.createReadStream(filepath);
      const writeStream = fs.createWriteStream(outputPath);

      readStream
        .pipe(transformer)
        .pipe(writeStream)
        .on("finish", resolve)
        .on("error", reject);
    });

    fs.unlinkSync(req.file.path);
    req.processedImage = image.split(".")[0] + ".webp";
    next();
  } catch (error) {
    next(error);
  }
};

const upload = multer({ storage: storage }).single("avatar");

module.exports = {
  upload,
  process,
};
