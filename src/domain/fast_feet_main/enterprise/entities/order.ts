import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { OrderAttachmentList } from "./attachment-list"
import { Optional } from "@/core/types"
import { AggregateRoot } from "@/core/entities/aggregate-root"
import { OrderStatusChangedEvent } from "../events/on-order-status-changed"

interface OrderProps {
    description: string
    status:  'PENDING' | 'PICKED_UP' | 'DELIVERED' | 'REFUND'
    recipientId: UniqueEntityID,
    userId: UniqueEntityID
    attachments: OrderAttachmentList
    latitude: number,
    longitude: number,
    createdAt: Date
    updatedAt?: Date | null
}

export class Order extends AggregateRoot<OrderProps> {

    get description() {
        return this.props.description
    }

    get status() {
        return this.props.status
    }

    get recipientId() {
        return this.props.recipientId
    }

    get userId() {
        return this.props.userId
    }

    get attachments() {
        return this.props.attachments
    }

    get latitude() {
        return this.props.latitude
    }

    get longitude() {
        return this.props.longitude
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    set attachments(attachmentList: OrderAttachmentList) {
        this.props.attachments = attachmentList
        this.touch()
    }

    set status(status: 'PENDING' | 'PICKED_UP' | 'DELIVERED' | 'REFUND') {
        this.props.status = status
        this.touch()

        if (status && status !== "PENDING") {
            this.addDomainEvent(new OrderStatusChangedEvent(this))
        }
    }

    set description(description: string) {
        this.props.description = description
        this.touch()
    }

    private touch() {
        this.props.updatedAt = new Date()
    }

    static create(
        props: Optional<OrderProps, 'createdAt' | 'attachments' | 'latitude' | 'longitude'>,
        id?: UniqueEntityID
    ) {
        const order = new Order(
            {
                createdAt: new Date(),
                attachments: props.attachments ?? new OrderAttachmentList(),
                latitude: 0,
                longitude: 0,
                ...props
            },
            id
        )

        /* const isNewOrder = !id

        if (isNewOrder) {
            order.addDomainEvent(new OrderCreatedEvent(order))
        } */

        return order
    }
}