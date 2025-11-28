import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { OrderDeliveryman } from "@/domain/fast_feet_main/enterprise/entities/order-deliveryman";
import { OrderWithDeliveryman } from "@/domain/fast_feet_main/enterprise/entities/value-objects/order-with-deliveryman";
import { Order, OrderAndDeliveryUser, Prisma, User } from '@prisma/client'

type PrismaOrderWithDeliveryman = OrderAndDeliveryUser & {order: Order, user: User}

export class PrismaOrderDeliverymanMapper {
    static toDomain(prisma: PrismaOrderWithDeliveryman): OrderWithDeliveryman {
        const orderWithDeliveryman = OrderWithDeliveryman.create({
            orderId: new UniqueEntityID(prisma.order.id),
            description: prisma.order.description,
            status: prisma.order.status,
            latitude: prisma.order.latitude.toNumber(),
            longitude: prisma.order.longitude.toNumber(),
            createdAt: prisma.order.createdAt,
            updatedAt: prisma.order.updatedAt ? prisma.order.updatedAt : new Date(),
            userId: new UniqueEntityID(prisma.user.id),
            name: prisma.user.name
        })

        return orderWithDeliveryman
    }

    static toPrisma(raw: OrderDeliveryman): Prisma.OrderAndDeliveryUserUncheckedCreateInput {
        return {
            orderId: raw.orderId.toString(),
            userId: raw.deliverymanId.toString(),
        }
    }
}