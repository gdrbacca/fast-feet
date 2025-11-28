import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { Notification as PrismaNotification, Prisma } from '@prisma/client'

export class PrismaNotificationMapper {

    static toDomain(raw: PrismaNotification): Notification {
        return Notification.create({
            title: raw.title,
            content: raw.content,
            recipientId: new UniqueEntityID(raw.recipientId),
            createdAt: raw.createdAt,
        }, new UniqueEntityID(raw.id))
    }

    static toPrisma(raw: Notification): Prisma.NotificationUncheckedCreateInput {
        return {
            id: raw.id.toString(),
            content: raw.content,
            recipientId: raw.recipientId.toString(),
            title: raw.title,
            createdAt: raw.createdAt
        }
    }
}