import { OrderRepository } from "@/domain/fast_feet_main/application/repository/order-repository";
import { Order } from "@/domain/fast_feet_main/enterprise/entities/order";
import { PrismaService } from "../prisma.service";
import { PrismaOrderMapper } from "./mapppers/order-mapper";
import { Injectable } from "@nestjs/common";
import { OrderAttachmentRepository } from "@/domain/fast_feet_main/application/repository/order-attachment-repository";
import { Order as PrismaOrder } from '@prisma/client'
import { DomainEvents } from "@/core/events/domain-events";
import { CacheRepository } from "@/infra/cache/cache-repository";

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
    constructor(
        private prisma: PrismaService,
        private orderAttachmentRepository: OrderAttachmentRepository,
        private cacheRepository: CacheRepository
    ) {}

    async findById(id_order: string): Promise<Order | null> {
        const cacheHit = await this.cacheRepository.get(`order:${id_order}`)

        if (cacheHit) {
            const cachedData = JSON.parse(cacheHit)

            return PrismaOrderMapper.toDomain(cachedData)
        }

        const order = await this.prisma.order.findUnique({
            where: {
                id: id_order
            }
        })

        if (!order)
            return null

        await this.cacheRepository.set(`order:${id_order}`, JSON.stringify(order))

        return PrismaOrderMapper.toDomain(order)
    }
    
    async create(order: Order): Promise<void> {
        await this.prisma.order.create({
            data: PrismaOrderMapper.toPrisma(order)
        })
    }

    async findMany(): Promise<Order[]> {
        const orders = await this.prisma.order.findMany()

        return PrismaOrderMapper.toDomainArray(orders)
    }

    async edit(id_order: string, order: Order): Promise<Order | null> {
        const order_updated = await this.prisma.order.update({
            where: {
                id: id_order,
            },
            data: PrismaOrderMapper.toPrisma(order)
        })

        if(order.attachments) {
            await this.orderAttachmentRepository.createMany(order.attachments.currentItems)
        } 

        await this.cacheRepository.delete(`order:${id_order}`)

        return PrismaOrderMapper.toDomain(order_updated)
    }

    async delete(id_order: string): Promise<void> {
        await this.prisma.order.delete({
            where: {
                id: id_order
            }
        })
    }

    async findOrdersNearby(latitude: number, longitude: number): Promise<Order[]> {
        const orders = await this.prisma.$queryRaw<PrismaOrder[]>`
            SELECT * from "order" where (
                6371 * ACOS(
                COS(RADIANS(${latitude})) * COS(RADIANS(latitude)) 
                * COS(RADIANS(longitude) - RADIANS(${longitude}))
                + SIN(RADIANS(${latitude})) * SIN(RADIANS(latitude))
            ) ) <= 10;
        `

        return PrismaOrderMapper.toDomainArray(orders)
    }

    async changeStatus(id_order: string, id_user: string, order: Order): Promise<Order | null> {
        const order_updated = await this.prisma.order.update({
            where: {
                id: id_order,
            },
            data: PrismaOrderMapper.toPrisma(order)
        })

        /* await this.prisma.orderAndDeliveryUser.create({
            data: {
                userId: id_user,
                orderId: id_order
            }
        }) */

        DomainEvents.dispatchEventsForAggregate(order.id)

        return PrismaOrderMapper.toDomain(order_updated)
    }

}