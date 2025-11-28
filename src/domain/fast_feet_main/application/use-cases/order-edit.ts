import { Either, left, right } from "@/core/either"
import { UserRepository } from "../repository/user-repository"
import { Injectable } from "@nestjs/common"
import { Order } from "../../enterprise/entities/order"
import { OrderRepository } from "../repository/order-repository"
import { EditNotAllowed } from "@/core/errors/edit-not-allowed"
import { OrderNotFound } from "@/core/errors/order-not-found"

interface OrderEditUseCaseProps {
    id_sub: string
    id_order: string
    status: 'PENDING' | 'PICKED_UP' | 'DELIVERED' | 'REFUND'
    description?: string
}

type OrderEditUseCaseResponse = Either<
    EditNotAllowed | OrderNotFound,
    { order: Order }
  >

@Injectable()
export class OrderEditUseCase {

    constructor(
        private orderRepository: OrderRepository,
        private userRepository: UserRepository,
    ) {}

    async execute({
        id_sub,
        id_order,
        status,
        description
    }: OrderEditUseCaseProps): Promise<OrderEditUseCaseResponse> {
        const userFromSub = await this.userRepository.findById(id_sub)

        if (userFromSub?.role !== 'ADMIN') {
            console.log('nmão é admin')
            return left(new EditNotAllowed())
        }

        const order_edit = await this.orderRepository.findById(id_order)
        
        if (!order_edit) {
            console.log('order not found 1')
            return left(new OrderNotFound())
        }

        order_edit.status = status
        if (description !== undefined)
            order_edit.description = description

        const order = await this.orderRepository.edit(id_order, order_edit)

        if (!order) {
            console.log('order not found 2')
            return left(new OrderNotFound())
        }

        return right({order})
    }
}