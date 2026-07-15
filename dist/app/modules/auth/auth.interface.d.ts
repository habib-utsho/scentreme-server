export type TLoginUser = {
    email: string;
    password: string;
};
export type TPasswordUpdate = {
    oldPassword: string;
    newPassword: string;
};
export type TResetPassword = {
    email: string;
    newPassword: string;
    passwordChangeAccessToken: string;
};
//# sourceMappingURL=auth.interface.d.ts.map