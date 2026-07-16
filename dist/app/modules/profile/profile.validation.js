"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.updateProfileZodSchema = zod_1.default.object({
    name: zod_1.default.string().min(5, "Name must be at least 5 characters long").optional(),
    phone: zod_1.default.string().min(10, "Phone number must be at least 10 digits long").optional(),
    date_of_birth: zod_1.default.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, "Invalid date format, expected a valid date string").optional(),
    gender: zod_1.default.enum(["Men", "Women", "Unisex"], "Gender must be 'Men', 'Women', or 'Unisex'").optional(),
});
//# sourceMappingURL=profile.validation.js.map