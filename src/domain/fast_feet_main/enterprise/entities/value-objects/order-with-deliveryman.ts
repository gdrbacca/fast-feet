import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";

interface OrderWithDeliverymanProps {
    orderId: UniqueEntityID
    description: string
    status: 'PENDING' | 'PICKED_UP' | 'DELIVERED' | 'REFUND'
    latitude: number
    longitude: number
    createdAt: Date
    updatedAt: Date
    userId: UniqueEntityID
    name: string
}

export class OrderWithDeliveryman extends ValueObject<OrderWithDeliverymanProps> {
    get orderId() {
        return this.props.orderId
    }

    get description() {
        return this.props.description
    }

    get status() {
        return this.props.status
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

    get userId() {
        return this.props.userId
    }

    get name() {
        return this.props.name
    }

    static create(props: OrderWithDeliverymanProps) {
        return new OrderWithDeliveryman(props)
    }
}