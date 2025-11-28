import { OrderDeliverymanRepository } from "@/domain/fast_feet_main/application/repository/order-deliveryman-repository";
import { OrderRepository } from "@/domain/fast_feet_main/application/repository/order-repository";
import { UserRepository } from "@/domain/fast_feet_main/application/repository/user-repository";
import { OrderDeliveryman } from "@/domain/fast_feet_main/enterprise/entities/order-deliveryman";
import { OrderWithDeliveryman } from "@/domain/fast_feet_main/enterprise/entities/value-objects/order-with-deliveryman";

export class InMemoryOrderDeliverymanRepository implements OrderDeliverymanRepository {
    public items: OrderDeliveryman[] = []

    constructor(
        private orderRepository: OrderRepository, 
        private userRepository: UserRepository
    ) {}

    async create(orderDeliveryman: OrderDeliveryman): Promise<void> {
        this.items.push(orderDeliveryman)
    }

    async createMany(orderDeliverymans: OrderDeliveryman[]): Promise<void> {
        if (orderDeliverymans.length === 0)
            return

        orderDeliverymans.map(item => (
            this.items.push(item)
        ))
    }

    async delete(orderDeliveryman: OrderDeliveryman): Promise<void> {
        this.items = this.items.filter(item => {
            return item.id.toString() !== orderDeliveryman.id.toString()
        })
    }

    async findManyByUserId(userId: string): Promise<OrderWithDeliveryman[] | undefined> {
        const arrayFiltered = this.items.filter(item => {
            return item.deliverymanId.toString() === userId
        })

        if (arrayFiltered.length === 0)
            return []

        const orderWithDeliverymanArray = await Promise.all(arrayFiltered.map(async item => {
            const user = await this.userRepository.findById(item.deliverymanId.toString())
            if (user) {
                const order = await this.orderRepository.findById(item.orderId.toString())
                
                if (order) {
                    return OrderWithDeliveryman.create({
                        orderId: order.id,
                        description: order.description,
                        status: order.status,
                        latitude: order.latitude,
                        longitude: order.longitude,
                        createdAt: order.createdAt,
                        updatedAt: order.updatedAt ? order.updatedAt : new Date(),
                        userId: user.id,
                        name: user.name
                    })
                }  
            }  
            return null
        }))

        const filtered = orderWithDeliverymanArray.filter((o): o is OrderWithDeliveryman => o !== null)

        return filtered
    }

    async findByUserAndOrderId(userId: string, orderId: string): Promise<OrderDeliveryman | null> {
        const orderWithDeliveryman = this.items.find(item => {
            return item.deliverymanId.toString() === userId && item.orderId.toString() === orderId
        })

        if (!orderWithDeliveryman)
            return null

        return orderWithDeliveryman
    }
}