import { Either, left, right } from "@/core/either"
import { Order } from "../../enterprise/entities/order"
import { Injectable } from "@nestjs/common"
import { GetNotAllowed } from "@/core/errors/get-not-allowed"
import { UserRepository } from "../repository/user-repository"
import { OrderRepository } from "../repository/order-repository"

interface OrderFindNearbyUseCaseRequest {
    id_sub: string
    latitude: number
    longitude: number
}

type OrderFindNearbyUseCaseResponse = Either<
    GetNotAllowed,
    { orders: Order[] }
>

@Injectable()
export class OrderFindNearbyUseCase {
    constructor(
        private userRepository: UserRepository,
        private orderRepository: OrderRepository
    ){}

    async execute({
        id_sub,
        latitude,
        longitude
    }: OrderFindNearbyUseCaseRequest): Promise<OrderFindNearbyUseCaseResponse> {
        const user = await this.userRepository.findById(id_sub)
        console.log('aquiiiiiii')
        if (!user) {
            return left(new GetNotAllowed())
        }

        if (user.role !== "ADMIN") {
            return left(new GetNotAllowed())
        }

        const orders = await this.orderRepository.findOrdersNearby(
            latitude,
            longitude
        )

        return right({orders})
    }
}