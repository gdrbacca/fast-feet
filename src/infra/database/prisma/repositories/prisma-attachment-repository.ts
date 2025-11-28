import { AttachmentRepository } from "@/domain/fast_feet_main/application/repository/attachment-repository";
import { Attachment } from "@/domain/fast_feet_main/enterprise/entities/attachment";
import { PrismaService } from "../prisma.service";
import { PrismaAttachmentMapper } from "./mapppers/attachment-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAttachmentRepository implements AttachmentRepository {
    constructor(private prisma: PrismaService) {}
    
    async create(attachment: Attachment): Promise<void> {
        console.log('attachment que chegou no prisma')
        console.log(attachment)
        await this.prisma.attachment.create({
            data: PrismaAttachmentMapper.toPrisma(attachment)
        })
    }

}