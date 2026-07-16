import jwt from "jsonwebtoken";
declare const jwtVerify: (token: string, tokenSecret: string) => Promise<jwt.JwtPayload>;
export default jwtVerify;
//# sourceMappingURL=jwtVerify.d.ts.map