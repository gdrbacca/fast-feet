export class RecipientNotFound extends Error {
    constructor() {
        super('Recipient not found!')
    }
}