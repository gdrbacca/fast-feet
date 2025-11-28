import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factory/user-factory"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository"
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository"
import { makeRecipient } from "test/factory/recipient-factory"
import { Order } from "../../enterprise/entities/order"
import { OrderFindNearbyUseCase } from "./order-find-nearby"
import { InMemoryOrderAttachmentRepository } from "test/repositories/in-memory-order-attachment-repository"

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryUserRepository: InMemoryUserRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let sut: OrderFindNearbyUseCase
let userId: UniqueEntityID
let recipientId: UniqueEntityID

describe('Order find nearby test', () => {
    beforeEach(() => {
        inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
        inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderAttachmentRepository)
        inMemoryUserRepository = new InMemoryUserRepository()
        inMemoryRecipientRepository = new InMemoryRecipientRepository()
        sut = new OrderFindNearbyUseCase(
            inMemoryUserRepository,
            inMemoryOrderRepository, 
        )

        inMemoryUserRepository.items.push(makeUser())
        userId = inMemoryUserRepository.items[0].id

        inMemoryRecipientRepository.items.push(makeRecipient())
        recipientId = inMemoryRecipientRepository.items[0].id
    })

    it('should be able to find nearby orders', async () => {
        const order = Order.create({
            description: 'Order 1',
            recipientId,
            userId,
            status: 'PENDING',
            latitude: -26.8465867,
            longitude: -49.1203584
        })

        const order2 = Order.create({
            description: 'Order 2',
            recipientId,
            userId,
            status: 'PENDING',
            latitude: -26.8705354,
            longitude: -49.1138514
        })

        const order3 = Order.create({
            description: 'Order 3',
            recipientId,
            userId,
            status: 'PENDING',
            latitude: -26.9775865,
            longitude: -49.0063074
        })

        inMemoryOrderRepository.items.push(order)
        inMemoryOrderRepository.items.push(order2)
        inMemoryOrderRepository.items.push(order3)

        const result = await sut.execute({
            id_sub: userId.toString(),
            latitude: -26.8813532,
            longitude: -49.1112895
        })

        console.log(result.value)

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            orders: expect.objectContaining([
                expect.objectContaining({
                    description: 'Order 1',
                }),
                expect.objectContaining({
                    description: 'Order 2',
                })
            ])
        })
    })

})