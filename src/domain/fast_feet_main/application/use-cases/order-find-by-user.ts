import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { GetNotAllowed } from "@/core/errors/get-not-allowed"
import { UserRepository } from "../repository/user-repository"
import { OrderDeliverymanRepository } from "../repository/order-deliveryman-repository"
import { OrderWithDeliveryman } from "../../enterprise/entities/value-objects/order-with-deliveryman"
import { OrderNotFound } from "@/core/errors/order-not-found"

interface OrderFindByUserUseCaseRequest {
    id_sub: string
}

type OrderFindByUserUseCaseResponse = Either<
    GetNotAllowed,
    { orders: OrderWithDeliveryman[] }
>

@Injectable()
export class OrderFindByUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private orderDeliverymanRepository: OrderDeliverymanRepository
    ){}

    async execute({
        id_sub,
    }: OrderFindByUserUseCaseRequest): Promise<OrderFindByUserUseCaseResponse> {
        const user = await this.userRepository.findById(id_sub)
        
        if (!user) {
            return left(new GetNotAllowed())
        }
        
        const orders = await this.orderDeliverymanRepository.findManyByUserId(
            id_sub
        )

        if (!orders) {
            return left(new OrderNotFound())
        }
        
        return right({orders})
    }
}