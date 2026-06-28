import { Router } from "express";
import zodValidateHandler from "../../middleware/zodValidateHandler";
import { profileController } from "./profile.controller";
import { updateProfileZodSchema } from "./profile.validation";


const router = Router()

router.get('/:id', profileController.getMe)

router.patch('/:id', zodValidateHandler(updateProfileZodSchema), profileController.updateProfile)

router.delete('/:id', profileController.deleteProfile)



export { router as profileRouter };