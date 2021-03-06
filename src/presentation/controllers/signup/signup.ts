import { HttpRequest, HttpResponse } from '../../protocols/http'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { AddAccount, Controller, EmailValidator } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
    const requiredFireld = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFireld) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { name, email, password, passwordConfirmation } = httpRequest.body
    if (passwordConfirmation !== password) {
      return badRequest(new InvalidParamError('passwordConfirmation'))
    }
    const isValid = this.emailValidator.isValid(email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
    this.addAccount.add({
      name,
      email,
      password
    })
  } catch (error) {
      return serverError()
    }
  }
}
