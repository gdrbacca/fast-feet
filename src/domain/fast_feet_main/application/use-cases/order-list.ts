import { Either, left, right } from "@/core/either"
import { UserRepository } from "../repository/user-repository"
import { Injectable } from "@nestjs/common"
import { Order } from "../../enterprise/entities/order"
import { OrderRepository } from "../repository/order-repository"
import { GetNotAllowed } from "@/core/errors/get-not-allowed"

interface OrderListUseCaseProps {
    id_sub: string
}

type OrderListUseCaseResponse = Either<
    GetNotAllowed,
    { orders: Order[] }
  >

@Injectable()
export class OrderListUseCase {

    constructor(
        private orderRepository: OrderRepository,
        private userRepository: UserRepository,
    ) {}

    async execute({
        id_sub,
    }: OrderListUseCaseProps): Promise<OrderListUseCaseResponse> {
        const userFromSub = await this.userRepository.findById(id_sub)

        if (userFromSub?.role !== 'ADMIN') {
            console.log('nmão é admin')
            return left(new GetNotAllowed())
        }

        
        const orders = await this.orderRepository.findMany()

        return right({orders})
    }
}