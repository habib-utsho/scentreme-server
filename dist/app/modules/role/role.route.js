"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRouter = void 0;
const express_1 = require("express");
const role_controller_1 = require("./role.controller");
const router = (0, express_1.Router)();
exports.roleRouter = router;
router.post('/', role_controller_1.roleController.createRole);
router.get('/', role_controller_1.roleController.getRoles);
//# sourceMappingURL=role.route.js.map