export class InvalidAttachmentType extends Error {
    constructor(fileType: string) {
        super(`Invalid attachment type: ${fileType}`)
    }
}