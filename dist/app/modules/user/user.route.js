"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const router = (0, express_1.Router)();
exports.userRouter = router;
router.post('/', uploadImgToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body?.data);
    console.log({ body: req.body, file: req.file });
    next();
}, (0, zodValidateHandler_1.default)(user_validation_1.createUserZodSchema), user_controller_1.userController.createUser);
router.get('/', (0, auth_1.default)(), user_controller_1.userController.getUsers);
router.get('/:id', user_controller_1.userController.getUserById);
//# sourceMappingURL=user.route.js.map