import { Router } from "express";
import { userController } from "./user.controller";
import zodValidateHandler from "../../middleware/zodValidateHandler";
import { createUserZodSchema } from "./user.validation";
import auth from "../../middleware/auth";


const router = Router()

router.post('/', zodValidateHandler(createUserZodSchema), userController.createUser)
router.get('/', auth(), userController.getUsers)
router.get('/:id', userController.getUserById)




export { router as userRouter };