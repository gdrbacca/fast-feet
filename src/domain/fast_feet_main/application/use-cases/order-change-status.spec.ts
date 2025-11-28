import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository"
import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { OrderChangeStatusUseCase } from "./order-change-status"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { makeUser } from "test/factory/user-factory"
import { makeOrder } from "test/factory/order-factory"
import { InMemoryOrderDeliverymanRepository } from "test/repositories/in-memory-order-deliveryman-repository"
import { InMemoryOrderAttachmentRepository } from "test/repositories/in-memory-order-attachment-repository"

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryUserRepository: InMemoryUserRepository
let inMemoryOrderDeliverymanRepository: InMemoryOrderDeliverymanRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let sut: OrderChangeStatusUseCase
let userAdminId: UniqueEntityID
let userDeliverymanId: UniqueEntityID

describe('Order change status test', () => {
    beforeEach(() => {
        inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
        inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderAttachmentRepository)
        inMemoryUserRepository = new InMemoryUserRepository()
        inMemoryOrderDeliverymanRepository = new InMemoryOrderDeliverymanRepository(
            inMemoryOrderRepository,
            inMemoryUserRepository
        )
        sut = new OrderChangeStatusUseCase(
            inMemoryOrderRepository, 
            inMemoryUserRepository,
            inMemoryOrderDeliverymanRepository
        )

        const userAdmin = makeUser({
            name: 'Procópio',
            role: 'ADMIN'
        })
        inMemoryUserRepository.items.push(userAdmin)
        userAdminId = userAdmin.id

        const userDeliveryman = makeUser({
            name: 'Ernesto',
            role: 'DELIVERYMAN'
        })
        inMemoryUserRepository.items.push(userDeliveryman)
        userDeliverymanId = userDeliveryman.id
    })

    it('should let deliveryman edit the status of an order', async () => {
        const order = makeOrder({
            description: 'Order 1',
            status: 'PENDING',
            userId: userAdminId
        })

        inMemoryOrderRepository.create(order)

        const result =  await sut.execute({
            id_order: order.id.toString(),
            id_sub: userDeliverymanId.toString(),
            status: 'PICKED_UP'
        })

        expect(result.value).toEqual(
            expect.objectContaining({
                order: expect.objectContaining({
                    status: 'PICKED_UP'
                })
            })
        )
    })

})