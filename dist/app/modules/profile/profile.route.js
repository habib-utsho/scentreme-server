"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRouter = void 0;
const express_1 = require("express");
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const profile_controller_1 = require("./profile.controller");
const profile_validation_1 = require("./profile.validation");
const router = (0, express_1.Router)();
exports.profileRouter = router;
router.get('/:id', profile_controller_1.profileController.getMe);
router.patch('/:id', (0, zodValidateHandler_1.default)(profile_validation_1.updateProfileZodSchema), profile_controller_1.profileController.updateProfile);
router.delete('/:id', profile_controller_1.profileController.deleteProfile);
//# sourceMappingURL=profile.route.js.map