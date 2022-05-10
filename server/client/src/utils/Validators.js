import { EMAIL_REGEX } from "../constants/constants"

export const isEmailValid = email => {
    return EMAIL_REGEX.test(email);
}

export const isEmailInValid = email => {
    return !isEmailValid(email);
}