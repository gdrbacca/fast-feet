import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { OrderAttachmentRepository } from "@/domain/fast_feet_main/application/repository/order-attachment-repository";
import { OrderAttachment } from "@/domain/fast_feet_main/enterprise/entities/order-attachment";
import { PrismaOrderAttachmentMapper } from "./mapppers/order-attachment-mapper";

@Injectable()
export class PrismaOrderAttachmentRepository implements OrderAttachmentRepository {
    constructor(
        private prisma: PrismaService,
    ) {}

    async createMany(attachments: OrderAttachment[]): Promise<void> {
        if (attachments.length === 0)
            return

        const data = PrismaOrderAttachmentMapper.toPrismaUpdateMany(attachments)

        await this.prisma.attachment.updateMany(data)
    }

    async deleteMany(attachments: OrderAttachment[]): Promise<void> {
        if (attachments.length === 0)
            return

        const attachmentsIds = attachments.map(attachment => {
            return attachment.attachmentId.toString()
        })

        await this.prisma.attachment.deleteMany({
            where: {
                id: {
                    in: attachmentsIds
                }
            }
        })
    }

    async findManyByOrderId(orderId: string): Promise<OrderAttachment[]> {
        const attachments = await this.prisma.attachment.findMany({
            where: {
                orderId
            }
        })

        return attachments.map(PrismaOrderAttachmentMapper.toDomain)
    }

    async deleteManyByOrderId(orderId: string): Promise<void> {
        await this.prisma.attachment.deleteMany({
            where: {
                orderId
            }
        })
    }


}