import { Either, left, right } from "@/core/either"
import { InvalidAttachmentType } from "@/core/errors/invalid-attachment-type-error"
import { Attachment } from "../../enterprise/entities/attachment"
import { Uploader } from "../storage/uploader"
import { AttachmentRepository } from "../repository/attachment-repository"
import { Injectable } from "@nestjs/common"
import { UserRepository } from "../repository/user-repository"
import { CreationNotAllowed } from "@/core/errors/creation-not-allowed"

interface UploadAndCreateAttachmentRequest {
    id_sub: string
    fileName: string
    fileType: string
    body: Buffer
}

type UploadAndCreateAttachmentResponse = Either<
    InvalidAttachmentType | CreationNotAllowed,
    {attachment: Attachment}
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
    constructor(
        private attachmentRepository: AttachmentRepository,
        private userRepository: UserRepository,
        private uploader: Uploader,
    ) {}

    async execute({
        id_sub,
        fileName,
        fileType,
        body
    }: UploadAndCreateAttachmentRequest): Promise<UploadAndCreateAttachmentResponse> {
        const user = await this.userRepository.findById(id_sub)

        if (!user) {
            return left(new CreationNotAllowed())
        }

        if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
            return left(new InvalidAttachmentType(fileType))
        } 

        const { url } = await this.uploader.upload({
            fileName,
            fileType,
            body,
        })

        const attachment = Attachment.create({
            title: fileName,
            url
        })

        await this.attachmentRepository.create(attachment)

        return right({attachment})
    }
}