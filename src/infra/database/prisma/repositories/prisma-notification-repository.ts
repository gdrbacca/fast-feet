import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotificationRepository } from "@/domain/notification/application/repositories/notification-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { PrismaService } from "../prisma.service";
import { PrismaNotificationMapper } from "./mapppers/notification-mapper";

export class PrismaNotificationRepository implements NotificationRepository {
    constructor(private prisma: PrismaService){}
    
    async create(notification: Notification): Promise<void> {
        await this.prisma.notification.create({
            data: PrismaNotificationMapper.toPrisma(notification)
        })
    }
    
    async findById(notificationId: UniqueEntityID): Promise<Notification | null> {
        const notification = await this.prisma.notification.findUnique({
            where: {
                id: notificationId.toString()
            }
        })

        if (!notification)
            return null

        return PrismaNotificationMapper.toDomain(notification)
    }

    async save(notification: Notification): Promise<void> {
        await this.prisma.notification.update({
            where: {
                id: notification.id.toString(),
            },
            data: PrismaNotificationMapper.toPrisma(notification)
        })
    }

}