export class CreationNotAllowed extends Error {
    constructor() {
        super('Creation not allowed!')
    }
}