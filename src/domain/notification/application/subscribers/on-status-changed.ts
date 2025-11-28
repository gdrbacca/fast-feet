import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { RecipientRepository } from "@/domain/fast_feet_main/application/repository/recipient-repository";
import { OrderStatusChangedEvent } from "@/domain/fast_feet_main/enterprise/events/on-order-status-changed";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnStatusChanged implements EventHandler {
    constructor(
        private recipientRepository: RecipientRepository, 
        private sendNotificationUseCase: SendNotificationUseCase
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.orderStatusChangedNotifiction.bind(this),
            OrderStatusChangedEvent.name
        )
    }

    private async orderStatusChangedNotifiction({ order }: OrderStatusChangedEvent) {
        const recipient = await this.recipientRepository.findById(order.recipientId.toString())

        if (recipient) {
            await this.sendNotificationUseCase.execute({
                recipientId: recipient.id.toString(),
                title: `Alteração de status em pedido: ${order.description.substring(0, 40).concat('...')}`,
                content: `Novo status: ${order.status}`
            })
        }
    }

}