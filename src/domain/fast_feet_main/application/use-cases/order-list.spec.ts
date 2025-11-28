import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factory/user-factory"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository"
import { OrderListUseCase } from "./order-list"
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository"
import { makeRecipient } from "test/factory/recipient-factory"
import { Order } from "../../enterprise/entities/order"
import { InMemoryOrderAttachmentRepository } from "test/repositories/in-memory-order-attachment-repository"

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryUserRepository: InMemoryUserRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let sut: OrderListUseCase
let userId: UniqueEntityID
let recipientId: UniqueEntityID

describe('Order list test', () => {
    beforeEach(() => {
        inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
        inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderAttachmentRepository)
        inMemoryUserRepository = new InMemoryUserRepository()
        inMemoryRecipientRepository = new InMemoryRecipientRepository()
        sut = new OrderListUseCase(
            inMemoryOrderRepository, 
            inMemoryUserRepository,
        )

        inMemoryUserRepository.items.push(makeUser())
        userId = inMemoryUserRepository.items[0].id

        inMemoryRecipientRepository.items.push(makeRecipient())
        recipientId = inMemoryRecipientRepository.items[0].id
    })

    it('should be able to create an order', async () => {
        inMemoryOrderRepository.items.push(Order.create({
            description: 'Order 1',
            recipientId,
            userId,
            status: 'PENDING'
        }))
        inMemoryOrderRepository.items.push(Order.create({
            description: 'Order 2',
            recipientId,
            userId,
            status: 'PENDING'
        }))
        inMemoryOrderRepository.items.push(Order.create({
            description: 'Order 3',
            recipientId,
            userId,
            status: 'PENDING'
        }))

        const result = await sut.execute({
            id_sub: userId.toString(),
        })


        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            orders: expect.objectContaining([
                expect.objectContaining({description: 'Order 1'}),
                expect.objectContaining({description: 'Order 2'}),
                expect.objectContaining({description: 'Order 3'}),
            ])
        })
    })

})