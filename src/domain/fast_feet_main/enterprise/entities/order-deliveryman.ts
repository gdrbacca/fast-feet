import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface OrderDeliverymanProps {
    orderId: UniqueEntityID
    deliverymanId: UniqueEntityID
}

export class OrderDeliveryman extends Entity<OrderDeliverymanProps>{

    get orderId() {
        return this.props.orderId
    }

    get deliverymanId() {
        return this.props.deliverymanId
    }

    static create(props: OrderDeliverymanProps, id?: UniqueEntityID) {
        const orderDeliveryman = new OrderDeliveryman({...props}, id)

        return orderDeliveryman
    }
}