export class GetNotAllowed extends Error {
    constructor() {
        super('Get not allowed!')
    }
}