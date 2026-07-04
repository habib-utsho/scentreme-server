import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../utils/sendResponse'
import { authServices } from './auth.service'
import AppError from '../../errors/appError'
import { JwtPayload } from 'jsonwebtoken'
import catchAsync from '../../../lib/catchAsync'
import { env } from '../../config/env'
import { CookieOptions } from 'express'

const login = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, needsPasswordChange } =
    await authServices.login(req.body)
  const isProduction = env.NODE_ENV === 'production';

  // res.clearCookie('accessToken');
  // res.clearCookie('refreshToken');

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  };

  // // Set both new tokens
  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'User is logged in successfully',
    data: { accessToken, refreshToken, needsPasswordChange },
  })
})
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body || req.cookies || {}
  if (!refreshToken) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Refresh token is required')
  }

  const { accessToken } = await authServices.refreshToken(refreshToken)


  const isProduction = env.NODE_ENV === 'production';

  // res.clearCookie('accessToken');
  // res.clearCookie('refreshToken');

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  };

  // // Set both new tokens
  res.cookie('accessToken', accessToken, cookieOptions);


  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Access token is retrieved successfully',
    data: { accessToken },
  })
})

const forgetPassword = catchAsync(async (req, res) => {
  const result = await authServices.forgetPassword(req.body)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message:
      'Reset your password within 10 minutes! Check your email for the reset link and also check the spam folder.',
    data: result,
  })
})
const resetPassword = catchAsync(async (req, res) => {
  const result = await authServices.resetPassword(
    req.body,
    req.user as JwtPayload,
  )

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Password is reset successfully!',
    data: result,
  })
})

const changePassword = catchAsync(async (req, res) => {
  const user = await authServices.changePassword(
    req.user as JwtPayload,
    req.body,
  )

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found')
  }

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Password is updated successfully!',
    data: user,
  })
})

export const authControllers = {
  login,
  refreshToken,
  forgetPassword,
  resetPassword,
  changePassword,
}
