export class DeleteNotAllowed extends Error {
    constructor() {
        super('Delete not allowed!')
    }
}