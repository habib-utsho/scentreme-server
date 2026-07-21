import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import zodValidateHandler from "../../middleware/zodValidateHandler";
import { createAdminModeratorZodSchema, createCustomerZodSchema } from "./user.validation";
import auth from "../../middleware/auth";
import { upload } from "../../utils/uploadImgToCloudinary";
import { Role } from "../../../generated/prisma/enums";


const router = Router()

router.post('/create-customer',
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body?.data)
        // console.log({ body: req.body, file: req.file });
        next()
    },
    zodValidateHandler(createCustomerZodSchema),
    userController.createCustomer
)

router.post('/create-admin-moderator',
    auth(Role.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body?.data)
        console.log({ body: req.body, file: req.file });
        next()
    },
    zodValidateHandler(createAdminModeratorZodSchema),
    userController.createAdminModerator
)

router.get('/', auth(Role.admin), userController.getUsers)
router.get('/:id', auth(Role.admin), userController.getUserById)




export { router as userRouter };