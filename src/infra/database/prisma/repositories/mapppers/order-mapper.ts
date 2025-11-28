import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Order } from "@/domain/fast_feet_main/enterprise/entities/order";
import { Order as PrismaOrder, Prisma } from '@prisma/client'

export class PrismaOrderMapper {

    static toDomain(raw: PrismaOrder): Order {
        return Order.create({
            description: raw.description,
            recipientId: new UniqueEntityID(raw.recipientId),
            userId: new UniqueEntityID(raw.userId),
            status: raw.status,
            latitude: raw.latitude.toNumber(),
            longitude: raw.longitude.toNumber(),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new UniqueEntityID(raw.id))
    }

    static toDomainArray(raw: PrismaOrder[]): Order[] {
        return raw.map(prismaOrder => {
            return Order.create({
                description: prismaOrder.description,
                recipientId: new UniqueEntityID(prismaOrder.recipientId),
                userId: new UniqueEntityID(prismaOrder.userId),
                status: prismaOrder.status,
                createdAt: prismaOrder.createdAt,
                updatedAt: prismaOrder.updatedAt,
                latitude:  prismaOrder.latitude.toNumber(),
                longitude: prismaOrder.longitude.toNumber(),
            })
        })
    }

    static toPrisma(raw: Order): Prisma.OrderUncheckedCreateInput {
        return {
            id: raw.id.toString(),
            description: raw.description,
            recipientId: raw.recipientId.toString(),
            userId: raw.userId.toString(),
            status: raw.status,
            latitude: raw.latitude,
            longitude: raw.longitude,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }
    }
}