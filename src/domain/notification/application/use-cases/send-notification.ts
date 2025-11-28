import { Either, right } from "@/core/either"
import { Notification } from "../../enterprise/entities/notification"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotificationRepository } from "../repositories/notification-repository"

interface SendNotificationUseCaseProps {
    recipientId: string
    title: string
    content: string
}

export type SendNotificationUseCaseResponse = Either<
  null,
  { notification: Notification }
>

export class SendNotificationUseCase {
    constructor(private notificationRepository: NotificationRepository){}

    async execute({
        recipientId,
        title,
        content
    }: SendNotificationUseCaseProps): Promise<SendNotificationUseCaseResponse> {
        const notification = Notification.create({
            recipientId: new UniqueEntityID(recipientId),
            title,
            content
        })

        await this.notificationRepository.create(notification)

        return right({
            notification
        })
    }
}