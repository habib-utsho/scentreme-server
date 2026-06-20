export type TErrorSource = {
    path: string | number | undefined,
    message: string

}

export type TGenericErrorResponse = {
    statusCode: number,
    message: string,
    errorSources: TErrorSource[]
}