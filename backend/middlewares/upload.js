import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed!"));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
