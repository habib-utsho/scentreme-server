import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import zodValidateHandler from "../../middleware/zodValidateHandler";
import { createUserZodSchema } from "./user.validation";
import auth from "../../middleware/auth";
import { upload } from "../../utils/uploadImgToCloudinary";


const router = Router()

router.post('/',
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body?.data)
        console.log({ body: req.body, file: req.file });
        next()
    },
    zodValidateHandler(createUserZodSchema),
    userController.createUser
)

router.get('/', auth(), userController.getUsers)
router.get('/:id', userController.getUserById)




export { router as userRouter };