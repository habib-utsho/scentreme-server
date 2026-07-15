"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const role_route_1 = require("../modules/role/role.route");
const profile_route_1 = require("../modules/profile/profile.route");
const auth_route_1 = require("../modules/auth/auth.route");
const router = (0, express_1.Router)();
const routes = [
    {
        path: '/user',
        route: user_route_1.userRouter
    },
    {
        path: '/profile',
        route: profile_route_1.profileRouter
    },
    {
        path: '/role',
        route: role_route_1.roleRouter
    },
    {
        path: "/auth",
        route: auth_route_1.authRouter
    }
];
routes.forEach(route => router.use(route.path, route.route));
exports.default = router;
//# sourceMappingURL=index.js.map