import { Either, left, right } from "@/core/either"
import { CreationNotAllowed } from "@/core/errors/creation-not-allowed"
import { UserRepository } from "../repository/user-repository"
import { Injectable } from "@nestjs/common"
import { Order } from "../../enterprise/entities/order"
import { OrderRepository } from "../repository/order-repository"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { RecipientRepository } from "../repository/recipient-repository"
import { RecipientNotFound } from "@/core/errors/recipient-not-found"

interface OrderCreateUseCaseProps {
    id_sub: string
    description: string
    status:  'PENDING' | 'PICKED_UP' | 'DELIVERED' | 'REFUND'
    recipientId: string
    latitude: number
    longitude: number
}

type OrderCreateUseCaseResponse = Either<
    CreationNotAllowed,
    { order: Order }
  >

@Injectable()
export class OrderCreateUseCase {

    constructor(
        private orderRepository: OrderRepository,
        private userRepository: UserRepository,
        private recipientRepository: RecipientRepository,
    ) {}

    async execute({
        id_sub,
        description,
        status,
        recipientId,
        latitude,
        longitude
    }: OrderCreateUseCaseProps): Promise<OrderCreateUseCaseResponse> {
        
        const userFromSub = await this.userRepository.findById(id_sub)
        // $2b$06$DITNh0iAFbaUZurk4j25KekY7FLRHJGzy7vjMHp3K00Zd6d4FxkHK
        if (userFromSub?.role !== 'ADMIN') {
            console.log('nmão é admin')
            return left(new CreationNotAllowed())
        }

        const recipient = await this.recipientRepository.findById(recipientId)

        if (!recipient) {
            return left(new RecipientNotFound())
        }

        const order = Order.create({
            description,
            recipientId: new UniqueEntityID(recipientId),
            userId: new UniqueEntityID(id_sub),
            status,
            latitude,
            longitude
        })
        
        await this.orderRepository.create(order)

        return right({order})
    }
}