import { StatusCodes } from "http-status-codes"
import { prisma } from "../../../lib/prisma"
import AppError from "../../errors/appError"
import { TLoginUser, TPasswordUpdate, TResetPassword } from "./auth.interface"
import { UserStatus } from "../../../generated/prisma/enums"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { sendEmail } from "../../utils/sendEmail"
import { env } from "../../config/env"
import jwtVerify from "../../utils/jwtVerify"


const login = async (payload: TLoginUser) => {


    const user = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (!user) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User not found!");
    }

    if (user.status === UserStatus.inactive) {
        throw new AppError(StatusCodes.FORBIDDEN, "This user is not active!");
    }

    if (user.status === UserStatus.deleted) {
        throw new AppError(StatusCodes.FORBIDDEN, "This user is deleted!");
    }

    const profile = await prisma.profile.findUnique({
        where: { user_id: user.id },
    });

    if (profile?.isDeleted) {
        throw new AppError(StatusCodes.FORBIDDEN, "This profile is deleted!");
    }

    const role = await prisma.role.findUnique({
        where: { id: user.role_id },
    });

    if (!role) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Role not found!");
    }

    //   Check if account is currently locked
    if (user.locked_until) {
        if (user.locked_until > new Date()) {
            const remainingTime = Math.ceil(
                (user.locked_until.getTime() - Date.now()) / 60000
            );

            throw new AppError(
                StatusCodes.FORBIDDEN,
                `Account is locked due to multiple failed login attempts. Please try again after ${remainingTime} minute(s).`
            );
        }

        // Lock expired -> reset attempts
        await prisma.user.update({
            where: { id: user.id },
            data: {
                failed_login_attempts: 0,
                locked_until: null,
            },
        });

        user.failed_login_attempts = 0;
        user.locked_until = null;
    }

    //   Verify password
    const isPasswordMatched = await bcrypt.compare(
        payload.password,
        user.password
    );

    if (!isPasswordMatched) {
        const attempts = (user.failed_login_attempts ?? 0) + 1;

        await prisma.user.update({
            where: { id: user.id },
            data: {
                failed_login_attempts: attempts,
                ...(attempts >= parseInt(process.env.MAX_LOGIN_ATTEMPTS as string) && {
                    locked_until: new Date(Date.now() + parseInt(process.env.LOCK_TIME as string)),
                }),
            },
        });

        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Incorrect password!"
        );
    }

    //   Generate JWT payload
    const jwtPayload = {
        userId: user.id,
        profileId: profile?.id,
        email: user.email,
        role: role.name,
        name: `${profile?.firstName} ${profile?.lastName}`,
        profileImg: profile?.avatar_url,
    };

    const accessToken = jwt.sign(
        jwtPayload,
        process.env.JWT_ACCESS_SECRET as string,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as string,
        } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
        jwtPayload,
        process.env.JWT_REFRESH_SECRET as string,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string,
        } as jwt.SignOptions
    );


    await prisma.user.update({
        where: { id: user.id },
        data: {
            last_login_at: new Date(),
            failed_login_attempts: 0,
            locked_until: null,
        },
    });

    const { password, ...safeUser } = user;

    return {
        accessToken,
        refreshToken,
        data: safeUser,
        needsPasswordChange: user.needsPasswordChange,
    };
};

const refreshToken = async (token: string) => {

    let decoded
    try {
        decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET as string,
        ) as JwtPayload
    } catch (e: any) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!')
    }

    const { email } = decoded

    // checking if the user is exist
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found !')
    }
    // checking if the user is already deleted

    if (user.status === UserStatus.inactive) {
        throw new AppError(StatusCodes.FORBIDDEN, 'This user is not active!')
    }
    if (user.status === UserStatus.deleted) {
        throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted!')
    }

    const profile = (await prisma.profile.findUnique({ where: { user_id: user?.id } }))
    if (profile?.isDeleted) {
        throw new AppError(StatusCodes.FORBIDDEN, 'This profile is deleted!')
    }

    const role = await prisma.role.findUnique({ where: { id: user?.role_id } })

    if (!role) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Role not found!')
    }

    const jwtPayload = {
        userId: user?.id,
        profileId: profile?.id,
        email: user?.email,
        role: role?.name,
        name: `${profile?.firstName} ${profile?.lastName}`,
        profileImg: profile?.avatar_url
    }


    const accessToken = jwt.sign(
        jwtPayload,
        process.env.JWT_ACCESS_SECRET as string,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as string,
        } as jwt.SignOptions,
    )

    return {
        accessToken
    }
}

const forgetPassword = async (payload: Record<string, unknown>) => {
    const user = await prisma.user.findUnique({ where: { email: payload.email as string } })

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    if (user.status === UserStatus.inactive) {
        throw new AppError(StatusCodes.FORBIDDEN, 'This user is not active!')
    }
    if (user.status === UserStatus.deleted) {
        throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted!')
    }

    const profile = (await prisma.profile.findUnique({ where: { user_id: user?.id } }))
    if (profile?.isDeleted) {
        throw new AppError(StatusCodes.FORBIDDEN, 'This profile is deleted!')
    }

    const role = await prisma.role.findUnique({ where: { id: user?.role_id } })

    if (!role) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Role not found!')
    }

    const jwtPayload = {
        userId: user?.id,
        profileId: profile?.id,
        email: user?.email,
        role: role?.name,
        name: `${profile?.firstName} ${profile?.lastName}`,
        profileImg: profile?.avatar_url
    }


    const accessToken = jwt.sign(
        jwtPayload,
        process.env.JWT_ACCESS_SECRET as string,
        {
            expiresIn: '10m' as string,
        } as jwt.SignOptions,
    )

    const resetLink = `${process.env.CLIENT_URL}/reset-password?email=${user.email}&token=${accessToken}`
    await sendEmail({
        toEmail: user.email,
        subject: `Reset Your Password – ${env.APP_NAME}`,
        text: `You requested a password reset for your account.
Please use the link below to reset your password:
${resetLink}
This link will expire in 10 minutes. If you did not request this, please ignore this email.`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset - ${env.APP_NAME}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f7fb;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .container {
      max-width: 650px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0,0,0,0.08);
      border: 1px solid #0000000f;
    }
    .header {
      background: linear-gradient(135deg, #1e40af, #0ea5e9);
      color: #ffffff;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header p {
      margin: 8px 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 35px 30px;
      color: #333333;
      line-height: 1.6;
    }
    .content h2 {
      margin-top: 0;
      font-size: 18px;
      color: #1e40af;
    }
    .info-box {
      background: #f8fafc;
      border-left: 4px solid #0ea5e9;
      padding: 16px;
      border-radius: 6px;
      margin: 20px 0;
      font-size: 14px;
      color: #475569;
    }
    .btn-wrapper {
      text-align: center;
      margin: 30px 0;
    }
    .btn {
      display: inline-block;
      background: #1e40af;
      color: #ffffff !important;
      padding: 14px 36px;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      font-size: 15px;
    }
    .btn:hover {
      background: #1d4ed8;
    }
    .footer {
      background: #0f172a;
      color: #94a3b8;
      text-align: center;
      padding: 20px;
      font-size: 13px;
    }
    .footer p {
      margin: 6px 0;
    }
  </style>
</head>

<body>
  <div class="container">
    
    <div class="header">
      <h1>${env.APP_NAME}</h1>
      <p>Secure Password Reset Request</p>
    </div>

    <div class="content">
      <h2>Hello ${profile?.firstName || 'User '} ${profile?.lastName || ''},</h2>

      <p>We received a request to reset your password for your ${env.APP_NAME} account.</p>

      <div class="info-box">
        For security reasons, this reset link will expire in <strong>10 minutes</strong>.
      </div>

      <div class="btn-wrapper">
        <a href="${resetLink}" class="btn">Reset Your Password</a>
      </div>

      <p>If you did not request a password reset, you can safely ignore this email. Your account will remain secure.</p>

      <p>If the button above does not work, copy and paste the link below into your browser:</p>
      <p style="word-break: break-all; font-size: 13px; color: #0ea5e9;">
        ${resetLink}
      </p>

      <p>Thank you,<br><strong>${env.APP_NAME} Security Team</strong></p>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} ${env.APP_NAME}. All rights reserved.</p>
      <p>This is an automated security message. Please do not reply directly to this email.</p>
    </div>

  </div>
</body>
</html>`});
    return { resetLink }
}

const resetPassword = async (
    payload: TResetPassword,
    jwtPayload: JwtPayload,
) => {
    console.log({ payload, jwtPayload })

    const decoded = (await jwtVerify(
        payload.passwordChangeAccessToken,
        process.env.JWT_ACCESS_SECRET as string,
    )) as JwtPayload

    if (!decoded) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized to reset password!')
    }

    if (decoded.email !== jwtPayload.email) {
        throw new AppError(
            StatusCodes.FORBIDDEN,
            'You are not authorized to reset password for this user',
        )
    }

    const user = await prisma.user.findUnique({ where: { email: payload.email } })

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    if (jwtPayload.email != user.email) {
        throw new AppError(
            StatusCodes.FORBIDDEN,
            'You are not authorized to reset password for this user',
        )
    }

    if (user.status === UserStatus.inactive) {
        throw new AppError(StatusCodes.FORBIDDEN, 'This user is not active!')
    }
    if (user.status === UserStatus.deleted) {
        throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted!')
    }

    const hashedPass = await bcrypt.hash(
        payload.newPassword,
        Number(process.env.SALT_ROUNDS),
    )

    const result = await prisma.user.update({
        where: { email: payload.email },
        data: { password: hashedPass, needsPasswordChange: false }
    })
    if (!result) {
        throw new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Failed to update password.',
        )
    }
    return result
}

const changePassword = async (
    userPayload: JwtPayload,
    payload: TPasswordUpdate,
) => {
    const user = await prisma.user.findUnique({ where: { email: userPayload.email } })

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    if (user.status === UserStatus.inactive) {
        throw new AppError(StatusCodes.FORBIDDEN, 'This user is not active!')
    }
    if (user.status === UserStatus.deleted) {
        throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted!')
    }

    const decryptPass = await bcrypt.compare(payload.oldPassword, user.password)
    if (!decryptPass) {
        throw new AppError(StatusCodes.FORBIDDEN, 'Old password is incorrect!')
    }

    const hashedPass = await bcrypt.hash(
        payload.newPassword,
        Number(process.env.SALT_ROUNDS),
    )

    const result = await prisma.user.update({
        where: { email: userPayload.email },
        data: { password: hashedPass, needsPasswordChange: false }
    })
    if (!result) {
        throw new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Failed to update password.',
        )
    }
    return result
}

export const authServices = {
    login,
    refreshToken,
    forgetPassword,
    resetPassword,
    changePassword,
}
