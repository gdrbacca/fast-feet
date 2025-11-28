import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Order } from "@/domain/fast_feet_main/enterprise/entities/order";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaOrderMapper } from "@/infra/database/prisma/repositories/mapppers/order-mapper";
import { Injectable } from "@nestjs/common";

export function makeOrder(override: Partial<Order> = {}, id?: UniqueEntityID): Order {
    const order = Order.create({
        description: 'Order example',
        status: 'PENDING',
        recipientId: new UniqueEntityID(),
        userId: new UniqueEntityID(),
        latitude: -26.9022172,
        longitude: -49.0815074,
        ...override
    }, id)

    return order
}

@Injectable()
export class MakeOrder {
    constructor(private prisma: PrismaService){}

    async create(override: Partial<Order> = {}): Promise<Order> {
        const order = makeOrder(override)
        console.log(order)
        await this.prisma.order.create({
            data: PrismaOrderMapper.toPrisma(order)
        })

        return order
    }
}