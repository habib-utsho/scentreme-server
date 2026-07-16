"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.uploadImgToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const appError_1 = __importDefault(require("../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("../config/env");
// Configuration
cloudinary_1.v2.config({
    cloud_name: env_1.env.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.env.CLOUDINARY_API_KEY,
    api_secret: env_1.env.CLOUDINARY_SECRET,
});
// TODO: Need to transform img
const uploadImgToCloudinary = async (fileName, filePath) => {
    const res = await cloudinary_1.v2.uploader
        .upload(filePath, {
        public_id: fileName,
    })
        .catch((error) => {
        throw new appError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `${error || 'Error uploading image to cloudinary'}`);
        //   console.log(error)
    });
    // Remove the file
    fs_1.default.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error removing file: ${err}`);
            return;
        }
        console.log(`File ${filePath} has been successfully removed.`);
    });
    return res;
};
exports.uploadImgToCloudinary = uploadImgToCloudinary;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
//# sourceMappingURL=uploadImgToCloudinary.js.map