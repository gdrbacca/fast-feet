import { Order } from "@/domain/fast_feet_main/enterprise/entities/order";
import { OrderWithDeliveryman } from "@/domain/fast_feet_main/enterprise/entities/value-objects/order-with-deliveryman";

export class GetOrdersPresenter {

    static toHttp(raw: Order) {
        return {
            id: raw.id.toString(),
            description: raw.description,
            status: raw.status,
            recipientId: raw.recipientId.toString()
        }
    }

    static toHttpArray(raw: OrderWithDeliveryman[]) {
        return raw.map(order => {
            return {
                id: order.orderId.toString(),
                description: order.description,
                status: order.status,
                latitude: order.latitude,
                longitude: order.longitude,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                userId: order.userId.toString(),
                name: order.name,
            }
        })
    }

    static toHttpArrayOnlyOrder(raw: Order[]) {
        return raw.map(order => {
            return {
                id: order.id.toString(),
                description: order.description,
                status: order.status,
                latitude: order.latitude,
                longitude: order.longitude,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            }
        })
    }
}