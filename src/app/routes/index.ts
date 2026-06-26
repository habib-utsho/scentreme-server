import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { roleRouter } from "../modules/role/role.route";
import { profileRouter } from "../modules/profile/profile.route";

const router = Router()

const routes = [
    {
        path: '/user',
        route: userRouter
    },
    {
        path: '/profile',
        route: profileRouter
    },
    {
        path: '/role',
        route: roleRouter
    }
]

routes.forEach(route => router.use(route.path, route.route))

export default router;