export class EditOrderWithAttachmentNotAllowed extends Error {
    constructor() {
        super('Edit order with attachment not allowed!')
    }
}