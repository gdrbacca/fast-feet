import { haversineDistance } from "@/core/calculate-distance-between-coord";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvents } from "@/core/events/domain-events";
import { OrderRepository } from "@/domain/fast_feet_main/application/repository/order-repository";
import { Order } from "@/domain/fast_feet_main/enterprise/entities/order";
import { InMemoryOrderAttachmentRepository } from "./in-memory-order-attachment-repository";

export class InMemoryOrderRepository implements OrderRepository {
    public items: Order[] = [];

    constructor(private inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository){}

    async create(order: Order): Promise<void> {
        this.items.push(order)
    }
    async findById(id_order: string): Promise<Order | null> {
        const order_index = this.items.findIndex(order => {
            return order.id.equals(new UniqueEntityID(id_order))
        })
        if (order_index === -1)
            return null

        return this.items[order_index]
    }

    async findMany(): Promise<Order[]> {
        return this.items
    }

    async edit(id_order: string, order: Order): Promise<Order | null> {
        const order_index = this.items.findIndex(order => {
            return order.id.equals(new UniqueEntityID(id_order))
        })

        if (order_index === -1)
            return null

        this.items[order_index] = order

        if (order.attachments) {
            this.inMemoryOrderAttachmentRepository.createMany(order.attachments.currentItems)
        }

        return this.items[order_index]
    }

    async delete(id_order: string): Promise<void> {
        const new_items = this.items.filter(item => {
            return item.id.toString() !== id_order
        })

        this.items = new_items
    }

    async findOrdersNearby(latitude: number, longitude: number): Promise<Order[]> {
        const orders = this.items.filter(item => {
            return haversineDistance(
                {latitude, longitude}, 
                {
                    latitude: item.latitude,
                    longitude: item.longitude
                }
            ) <= 10
        })

        return orders
    }

    async changeStatus(id_order: string, id_user: string, order: Order): Promise<Order | null> {
        const order_index = this.items.findIndex(order => {
            return order.id.equals(new UniqueEntityID(id_order))
        })

        if (order_index === -1)
            return null

        this.items[order_index] = order

        DomainEvents.dispatchEventsForAggregate(order.id)

        return this.items[order_index]
    }
}