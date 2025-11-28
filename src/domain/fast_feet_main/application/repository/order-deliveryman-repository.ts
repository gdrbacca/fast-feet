import { OrderDeliveryman } from "../../enterprise/entities/order-deliveryman";
import { OrderWithDeliveryman } from "../../enterprise/entities/value-objects/order-with-deliveryman";

export abstract class OrderDeliverymanRepository {
    abstract create(orderDeliveryman: OrderDeliveryman): Promise<void>
    abstract createMany(orderDeliverymans: OrderDeliveryman[]): Promise<void>
    abstract delete(orderDeliveryman: OrderDeliveryman): Promise<void>
    abstract findManyByUserId(userId: string): Promise<OrderWithDeliveryman[] | undefined>
    abstract findByUserAndOrderId(userId: string, orderId: string): Promise<OrderDeliveryman | null>
}