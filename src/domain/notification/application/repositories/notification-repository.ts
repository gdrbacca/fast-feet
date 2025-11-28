import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Notification } from "../../enterprise/entities/notification";

export abstract class NotificationRepository {
    abstract findById(notificationId: UniqueEntityID): Promise<Notification | null>
    abstract create(notification: Notification): Promise<void>
    abstract save(notification: Notification): Promise<void>
}