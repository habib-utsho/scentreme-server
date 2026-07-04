import { Router } from "express";
import { authControllers } from "./auth.controller";
import zodValidateHandler from "../../middleware/zodValidateHandler";
import { authZodSchema } from "./auth.validation";

const router = Router();

router.post(
  "/login",
  zodValidateHandler(authZodSchema.signinZodSchema),
  authControllers.login
);
router.post("/refresh-token", authControllers.refreshToken);
router.post(
  "/forget-password",
  zodValidateHandler(authZodSchema.forgetPasswordZodSchema),
  authControllers.forgetPassword
);
router.post(
  "/reset-password",
  zodValidateHandler(authZodSchema.resetPasswordZodSchema),
  authControllers.resetPassword
);
router.patch(
  "/change-password",
  zodValidateHandler(authZodSchema.changePasswordZodSchema),
  authControllers.changePassword
);

export { router as authRouter };
