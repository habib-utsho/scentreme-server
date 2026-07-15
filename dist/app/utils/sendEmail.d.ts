type TPayload = {
    toEmail: string;
    text: string;
    subject: string;
    html: string;
};
export declare const sendEmail: (payload: TPayload) => Promise<void>;
export {};
//# sourceMappingURL=sendEmail.d.ts.map