import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { OrderAttachment } from "@/domain/fast_feet_main/enterprise/entities/order-attachment";
import { Attachment as PrismaAttachment, Prisma } from '@prisma/client'

export class PrismaOrderAttachmentMapper {

    static toDomain(raw: PrismaAttachment): OrderAttachment {
        if (!raw.orderId) {
            throw new Error('Invalid attachment type.')
        }

        return OrderAttachment.create({
            attachmentId: new UniqueEntityID(raw.id),
            orderId: new UniqueEntityID(raw.orderId)
        }, new UniqueEntityID(raw.id))
    }

    static toPrismaUpdateMany(attachments: OrderAttachment[]): Prisma.AttachmentUpdateManyArgs {
        const attachmentsIds = attachments.map(attachment => {
            return attachment.attachmentId.toString()
        })

        return {
            where: {
                id: {
                    in: attachmentsIds
                }
            },
            data: {
                orderId: attachments[0].orderId.toString()
            }
        }
    }
}