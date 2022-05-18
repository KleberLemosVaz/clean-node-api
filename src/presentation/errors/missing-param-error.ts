export class MissingParamError extends Error {
    constructor (paramName: string) {
        super(`Missing params: ${paramName}`)
        this.name = 'MissingParamError'
    }
}
