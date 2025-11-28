import { AttachmentRepository } from "@/domain/fast_feet_main/application/repository/attachment-repository";
import { Attachment } from "@/domain/fast_feet_main/enterprise/entities/attachment";

export class InMemoryAttachmentRepository implements AttachmentRepository {
    public items: Attachment[] = [];

    async create(attachment: Attachment): Promise<void> {
        this.items.push(attachment)
    }
}