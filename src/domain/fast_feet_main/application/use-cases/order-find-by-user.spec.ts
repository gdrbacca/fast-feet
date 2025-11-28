import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factory/user-factory"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository"
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository"
import { makeRecipient } from "test/factory/recipient-factory"
import { Order } from "../../enterprise/entities/order"
import { OrderFindByUserUseCase } from "./order-find-by-user"
import { InMemoryOrderDeliverymanRepository } from "test/repositories/in-memory-order-deliveryman-repository"
import { OrderDeliveryman } from "../../enterprise/entities/order-deliveryman"
import { InMemoryOrderAttachmentRepository } from "test/repositories/in-memory-order-attachment-repository"

let inMemoryOrderDeliverymanRepository: InMemoryOrderDeliverymanRepository
let inMemoryUserRepository: InMemoryUserRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let sut: OrderFindByUserUseCase
let userId: UniqueEntityID
let userId2: UniqueEntityID
let recipientId: UniqueEntityID

describe('Order find by user test', () => {
    beforeEach(() => {
        inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
        inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderAttachmentRepository)
        inMemoryUserRepository = new InMemoryUserRepository()
        inMemoryOrderDeliverymanRepository = new InMemoryOrderDeliverymanRepository(
            inMemoryOrderRepository,
            inMemoryUserRepository,
        )
        inMemoryRecipientRepository = new InMemoryRecipientRepository()
        sut = new OrderFindByUserUseCase(
            inMemoryUserRepository,
            inMemoryOrderDeliverymanRepository, 
        )

        inMemoryUserRepository.items.push(makeUser())
        userId = inMemoryUserRepository.items[0].id

        inMemoryUserRepository.items.push(makeUser())
        userId2 = inMemoryUserRepository.items[1].id

        inMemoryRecipientRepository.items.push(makeRecipient())
        recipientId = inMemoryRecipientRepository.items[0].id
    })

    it('should be able to find orders by a user', async () => {
        const order = Order.create({
            description: 'Order 1',
            recipientId,
            userId,
            status: 'PICKED_UP',
            latitude: -26.8465867,
            longitude: -49.1203584
        })

        const order2 = Order.create({
            description: 'Order 2',
            recipientId,
            userId,
            status: 'PICKED_UP',
            latitude: -26.8705354,
            longitude: -49.1138514
        })

        const order3 = Order.create({
            description: 'Order 3',
            recipientId,
            userId,
            status: 'PICKED_UP',
            latitude: -26.9775865,
            longitude: -49.0063074
        })

        const order4 = Order.create({
            description: 'Order 4',
            recipientId,
            userId: userId,
            status: 'PICKED_UP',
            latitude: -26.9775865,
            longitude: -49.0063074
        })

        inMemoryOrderRepository.items.push(order)
        inMemoryOrderRepository.items.push(order2)
        inMemoryOrderRepository.items.push(order3)
        inMemoryOrderRepository.items.push(order4)

        inMemoryOrderDeliverymanRepository.items.push(OrderDeliveryman.create({
            deliverymanId: userId2,
            orderId: order.id
        }))
        inMemoryOrderDeliverymanRepository.items.push(OrderDeliveryman.create({
            deliverymanId: userId2,
            orderId: order2.id
        }))
        inMemoryOrderDeliverymanRepository.items.push(OrderDeliveryman.create({
            deliverymanId: userId2,
            orderId: order3.id
        }))

        const result = await sut.execute({
            id_sub: userId2.toString(),
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
                }),
                expect.objectContaining({
                    description: 'Order 3',
                })
            ])
        })
    })

})