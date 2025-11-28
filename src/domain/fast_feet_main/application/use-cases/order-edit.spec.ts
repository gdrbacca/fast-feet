import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factory/user-factory"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository"
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository"
import { makeRecipient } from "test/factory/recipient-factory"
import { Order } from "../../enterprise/entities/order"
import { OrderEditUseCase } from "./order-edit"
import { InMemoryOrderAttachmentRepository } from "test/repositories/in-memory-order-attachment-repository"

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryUserRepository: InMemoryUserRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let sut: OrderEditUseCase
let userId: UniqueEntityID
let recipientId: UniqueEntityID

describe('Order edit test', () => {
    beforeEach(() => {
        inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
        inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderAttachmentRepository)
        inMemoryUserRepository = new InMemoryUserRepository()
        inMemoryRecipientRepository = new InMemoryRecipientRepository()
        sut = new OrderEditUseCase(
            inMemoryOrderRepository, 
            inMemoryUserRepository,
        )

        inMemoryUserRepository.items.push(makeUser())
        userId = inMemoryUserRepository.items[0].id

        inMemoryRecipientRepository.items.push(makeRecipient())
        recipientId = inMemoryRecipientRepository.items[0].id
    })

    it('should be able to edit an order', async () => {
        const order = Order.create({
            description: 'Order 1',
            recipientId,
            userId,
            status: 'PENDING',
        })

        inMemoryOrderRepository.items.push(order)

        const result = await sut.execute({
            id_sub: userId.toString(),
            id_order: order.id.toString(),
            description: 'Order 1 edited',
            status: 'PICKED_UP'
        })

        console.log(result.value)

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            order: expect.objectContaining(
                {description: 'Order 1 edited'},
            )
        })
    })

})