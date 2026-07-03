"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createUserZodSchema = zod_1.default.object({
    email: zod_1.default.string().email("Invalid email address"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters long"),
    first_name: zod_1.default.string().min(2, "First name must be at least 2 characters long"),
    last_name: zod_1.default.string().min(2, "Last name must be at least 2 characters long"),
    phone: zod_1.default.string().min(10, "Phone number must be at least 10 digits long"),
    date_of_birth: zod_1.default.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, "Invalid date format, expected a valid date string"),
    gender: zod_1.default.enum(["Men", "Women", "Unisex"], "Gender must be 'Men', '  Women', or 'Unisex'"),
    role_id: zod_1.default.string().optional().nullable(),
    status: zod_1.default.enum(["active", "inactive"], "Status must be 'active' or 'inactive'").optional(),
});
//# sourceMappingURL=user.validation.js.map