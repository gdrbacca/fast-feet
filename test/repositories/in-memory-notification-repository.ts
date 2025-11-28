import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotificationRepository } from "@/domain/notification/application/repositories/notification-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationRepository implements NotificationRepository {
    public items: Notification[] = []

    async findById(notificationId: UniqueEntityID): Promise<Notification | null> {
        const notification = this.items.find(item => {
            return notificationId?.equals(item.id)
        })

        if (!notification)
            return null

        return notification
    }

    async create(notification: Notification): Promise<void> {
        this.items.push(notification)
    }

    async save(notification: Notification): Promise<void> {
        const index = this.items.findIndex(item => {
            return item.id.toString() === notification.id.toString()
        })

        if (index !== -1) {
            this.items[index] = notification
        }
    }

}