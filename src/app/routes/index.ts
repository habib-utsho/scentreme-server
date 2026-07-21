import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { profileRouter } from "../modules/profile/profile.route";
import { authRouter } from "../modules/auth/auth.route";
import { addressRouter } from "../modules/address/address.route";

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
        path: "/auth",
        route: authRouter
    },
    {
        path: "/address",
        route: addressRouter
    }
]

routes.forEach(route => router.use(route.path, route.route))

export default router;