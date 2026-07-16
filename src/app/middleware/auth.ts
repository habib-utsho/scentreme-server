import { NextFunction, Request, Response } from 'express'
import AppError from '../errors/appError'
import { StatusCodes } from 'http-status-codes'
import { JwtPayload } from 'jsonwebtoken'
import catchAsync from '../../lib/catchAsync'
import * as cookie from 'cookie'
import jwtVerify from '../utils/jwtVerify'
import { prisma } from '../../lib/prisma'
import { Role, UserStatus } from '../../generated/prisma/enums'
import { env } from '../config/env'


const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        // Parse cookies from header
        const token = req.headers.authorization || `Bearer ${cookie.parseCookie(req.headers?.cookie || "")?.accessToken}`;
        console.log({ token });


        if (!token) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!')
        }

        const bearerToken = token.split(' ')?.[1]
        if (!bearerToken) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!')
        }


        const decoded = (await jwtVerify(
            bearerToken,
            env.JWT_ACCESS_SECRET
        )) as JwtPayload



        const { email } = decoded

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found!')
        }

        const isDeleted = user?.status === UserStatus.deleted
        const isInactive = user?.status === UserStatus.inactive

        if (isDeleted) {
            throw new AppError(StatusCodes.GONE, 'This user is deleted!')
        }
        if (isInactive) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'This user is not active!')
        }

        if (requiredRoles.length && !requiredRoles.includes(user.role as Role)) {
            throw new AppError(StatusCodes.FORBIDDEN, 'You do not have permission to access this resource!')
        }

        req.user = decoded as JwtPayload

        next()
    })
}

export default auth
