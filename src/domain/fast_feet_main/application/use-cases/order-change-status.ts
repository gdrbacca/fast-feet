import { Either, left, right } from "@/core/either"
import { UserRepository } from "../repository/user-repository"
import { Injectable } from "@nestjs/common"
import { Order } from "../../enterprise/entities/order"
import { OrderRepository } from "../repository/order-repository"
import { OrderNotFound } from "@/core/errors/order-not-found"
import { ChangeStatusNotAllowed } from "@/core/errors/change-status-not-allowed"
import { OrderDeliverymanRepository } from "../repository/order-deliveryman-repository"
import { OrderDeliveryman } from "../../enterprise/entities/order-deliveryman"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

interface OrderChangeStatusUseCaseProps {
    id_sub: string
    id_order: string
    status: 'PENDING' | 'PICKED_UP' | 'DELIVERED' | 'REFUND'
}

type OrderChangeStatusUseCaseResponse = Either<
    ChangeStatusNotAllowed | OrderNotFound,
    { order: Order }
  >

@Injectable()
export class OrderChangeStatusUseCase {

    constructor(
        private orderRepository: OrderRepository,
        private userRepository: UserRepository,
        private orderDeliverymanRepository: OrderDeliverymanRepository
    ) {}

    async execute({
        id_sub,
        id_order,
        status,
    }: OrderChangeStatusUseCaseProps): Promise<OrderChangeStatusUseCaseResponse> {
        const userFromSub = await this.userRepository.findById(id_sub)

        if (!userFromSub) {
            return left(new ChangeStatusNotAllowed())
        }

        const order_edit = await this.orderRepository.findById(id_order)
        
        if (!order_edit) {
            console.log('order not found1! order-change-status')
            return left(new OrderNotFound())
        }

        order_edit.status = status

        const order = await this.orderRepository.changeStatus(id_order, id_sub, order_edit)

        if (!order) {
            console.log('order not found2! order-change-status')
            return left(new OrderNotFound())
        }

        const orderWithDeliveryman = await this.orderDeliverymanRepository.findByUserAndOrderId(id_sub, id_order)
        
        if (!orderWithDeliveryman) {
            const orderDeliveryMan = OrderDeliveryman.create({
                deliverymanId: new UniqueEntityID(id_sub),
                orderId: new UniqueEntityID(id_order)
            })
    
            await this.orderDeliverymanRepository.create(orderDeliveryMan)
        }

        console.log(order)

        return right({order})
    }
}