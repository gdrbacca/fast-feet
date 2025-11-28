import { Either, left, right } from "@/core/either"
import { UserRepository } from "../repository/user-repository"
import { Injectable } from "@nestjs/common"
import { OrderRepository } from "../repository/order-repository"
import { OrderNotFound } from "@/core/errors/order-not-found"
import { DeleteNotAllowed } from "@/core/errors/delete-not-allowed"

interface OrderDeleteUseCaseRequest {
    id_sub: string,
    id_order: string,
}

type OrderDeleteUseCaseResponse = Either<
    DeleteNotAllowed | OrderNotFound,
    {}
  >

@Injectable()
export class OrderDeleteUseCase {

    constructor(
        private orderRepository: OrderRepository,
        private userRepository: UserRepository,
    ) {}

    async execute({
        id_sub,
        id_order,
    }: OrderDeleteUseCaseRequest): Promise<OrderDeleteUseCaseResponse> {
        const userFromSub = await this.userRepository.findById(id_sub)

        if (userFromSub?.role !== 'ADMIN') {
            console.log('nmão é admin')
            return left(new DeleteNotAllowed())
        }

        const order_edit = await this.orderRepository.findById(id_order)
        
        if (!order_edit) {
            console.log('order not found 1')
            return left(new OrderNotFound())
        }

        await this.orderRepository.delete(id_order)

        return right({})
    }
}