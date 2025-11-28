export class ChangeStatusNotAllowed extends Error {
    constructor() {
        super('Change status not allowed!')
    }
}