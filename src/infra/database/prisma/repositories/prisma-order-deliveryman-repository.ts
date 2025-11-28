import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { OrderDeliverymanRepository } from "@/domain/fast_feet_main/application/repository/order-deliveryman-repository";
import { OrderDeliveryman } from "@/domain/fast_feet_main/enterprise/entities/order-deliveryman";
import { PrismaOrderDeliverymanMapper } from "./mapppers/order-deliveryman-mapper";
import { OrderWithDeliveryman } from "@/domain/fast_feet_main/enterprise/entities/value-objects/order-with-deliveryman";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

@Injectable()
export class PrismaOrderDeliverymanRepository implements OrderDeliverymanRepository {
    constructor(
        private prisma: PrismaService,
    ) {}

    async create(orderDeliveryman: OrderDeliveryman): Promise<void> {
        await this.prisma.orderAndDeliveryUser.create({
            data: PrismaOrderDeliverymanMapper.toPrisma(orderDeliveryman)
        })
    }

    async delete(orderDeliveryman: OrderDeliveryman): Promise<void> {
        await this.prisma.orderAndDeliveryUser.delete({
            where: {
                orderId: orderDeliveryman.orderId.toString()
            }
        })
    }

    async createMany(orderDeliverymans: OrderDeliveryman[]): Promise<void> {
        if (orderDeliverymans.length === 0)
            return

        const data = orderDeliverymans.map(item => { 
            return PrismaOrderDeliverymanMapper.toPrisma(item)
        })

        await this.prisma.orderAndDeliveryUser.createMany({
            data
        })
    }


    async findManyByUserId(userId: string): Promise<OrderWithDeliveryman[]> {
        const orderDeliverymans = await this.prisma.orderAndDeliveryUser.findMany({
            where: {
                userId
            },
            include: {
                order: true,
                user: true,
            }
        })

        return orderDeliverymans.map(PrismaOrderDeliverymanMapper.toDomain)
    }

    async findByUserAndOrderId(userId: string, orderId: string): Promise<OrderDeliveryman | null> {
        const orderWithDeliveryman = await this.prisma.orderAndDeliveryUser.findUnique({
            where: {
                orderId,
                userId
            }
        })

        if (!orderWithDeliveryman) {
            return null
        }

        return OrderDeliveryman.create({
            deliverymanId: new UniqueEntityID(orderWithDeliveryman.userId),
            orderId: new UniqueEntityID(orderWithDeliveryman.orderId)
        })
    }

}