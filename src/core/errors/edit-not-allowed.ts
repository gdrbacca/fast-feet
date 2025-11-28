export class EditNotAllowed extends Error {
    constructor() {
        super('Edit not allowed!')
    }
}