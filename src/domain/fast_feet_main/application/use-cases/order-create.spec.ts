import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factory/user-factory"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { OrderCreateUseCase } from "./order-create"
import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository"
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository"
import { makeRecipient } from "test/factory/recipient-factory"
import { InMemoryOrderAttachmentRepository } from "test/repositories/in-memory-order-attachment-repository"

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryUserRepository: InMemoryUserRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let sut: OrderCreateUseCase
let userId: UniqueEntityID
let recipientId: UniqueEntityID

describe('Create order test', () => {
    beforeEach(() => {
        inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
        inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderAttachmentRepository)
        inMemoryUserRepository = new InMemoryUserRepository()
        inMemoryRecipientRepository = new InMemoryRecipientRepository()
        sut = new OrderCreateUseCase(
            inMemoryOrderRepository, 
            inMemoryUserRepository,
            inMemoryRecipientRepository
        )

        inMemoryUserRepository.items.push(makeUser())
        userId = inMemoryUserRepository.items[0].id
        inMemoryRecipientRepository.items.push(makeRecipient())
        recipientId = inMemoryRecipientRepository.items[0].id
    })

    it('should be able to create an order', async () => {
        const result = await sut.execute({
            id_sub: userId.toString(),
            description: 'Order description',
            status: 'PENDING',
            recipientId: recipientId.toString(),
            latitude: -26.8921359,
            longitude: -49.005693
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryOrderRepository.items).toHaveLength(1)
    })

})