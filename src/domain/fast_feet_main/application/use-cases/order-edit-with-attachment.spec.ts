import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factory/user-factory"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository"
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository"
import { makeRecipient } from "test/factory/recipient-factory"
import { Order } from "../../enterprise/entities/order"
import { InMemoryOrderAttachmentRepository } from "test/repositories/in-memory-order-attachment-repository"
import { OrderAttachment } from "../../enterprise/entities/order-attachment"
import { OrderEditWithAttachmentUseCase } from "./order-edit-with-attachment"
import { InMemoryOrderDeliverymanRepository } from "test/repositories/in-memory-order-deliveryman-repository"
import { OrderDeliveryman } from "../../enterprise/entities/order-deliveryman"
import { NotSameDeliveryman } from "@/core/errors/not-same-deliveryman"

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryUserRepository: InMemoryUserRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let inMemoryOrderDeliverymanRepository: InMemoryOrderDeliverymanRepository
let sut: OrderEditWithAttachmentUseCase
let userId: UniqueEntityID
let userDeliverymanId: UniqueEntityID
let userDeliverymanId2: UniqueEntityID
let recipientId: UniqueEntityID

describe('Order edit with attachment test', () => {
    beforeEach(() => {
        inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
        inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderAttachmentRepository)
        inMemoryUserRepository = new InMemoryUserRepository()
        inMemoryRecipientRepository = new InMemoryRecipientRepository()
        inMemoryOrderDeliverymanRepository = new InMemoryOrderDeliverymanRepository(
            inMemoryOrderRepository,
            inMemoryUserRepository
        )
        sut = new OrderEditWithAttachmentUseCase(
            inMemoryOrderRepository, 
            inMemoryUserRepository,
            inMemoryOrderDeliverymanRepository
        )

        inMemoryUserRepository.items.push(makeUser())
        userId = inMemoryUserRepository.items[0].id

        inMemoryUserRepository.items.push(makeUser({
            name: 'Roberson',
            role: 'DELIVERYMAN'
        }))
        userDeliverymanId = inMemoryUserRepository.items[1].id

        inMemoryUserRepository.items.push(makeUser({
            name: 'Clodoaldo',
            role: 'DELIVERYMAN'
        }))
        userDeliverymanId2 = inMemoryUserRepository.items[2].id

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

        const orderDeliveryman = OrderDeliveryman.create({
            orderId: order.id,
            deliverymanId: userDeliverymanId
        })

        inMemoryOrderDeliverymanRepository.items.push(orderDeliveryman)

        const orderAttachment1 = OrderAttachment.create({
            orderId: order.id,
            attachmentId: new UniqueEntityID('attachment1')
        })

        const orderAttachment2 = OrderAttachment.create({
            orderId: order.id,
            attachmentId: new UniqueEntityID('attachment2')
        })

        const result = await sut.execute({
            id_sub: userDeliverymanId.toString(),
            id_order: order.id.toString(),
            attachments: [orderAttachment1.id.toString(), orderAttachment2.id.toString()]
        })

        console.log(result.value)

        expect(result.isRight()).toBe(true)
        expect(inMemoryOrderAttachmentRepository.items.length).toEqual(2)
    })

    it('should not be able to edit an order with different deliveryman', async () => {
        const order = Order.create({
            description: 'Order 1',
            recipientId,
            userId,
            status: 'PICKED_UP',
        })

        inMemoryOrderRepository.items.push(order)

        const orderDeliveryman = OrderDeliveryman.create({
            orderId: order.id,
            deliverymanId: userDeliverymanId
        })

        inMemoryOrderDeliverymanRepository.items.push(orderDeliveryman)

        const orderAttachment1 = OrderAttachment.create({
            orderId: order.id,
            attachmentId: new UniqueEntityID('attachment1')
        })

        const orderAttachment2 = OrderAttachment.create({
            orderId: order.id,
            attachmentId: new UniqueEntityID('attachment2')
        })

        const result = await sut.execute({
            id_sub: userDeliverymanId2.toString(),
            id_order: order.id.toString(),
            attachments: [orderAttachment1.id.toString(), orderAttachment2.id.toString()]
        })

        console.log(result.value)

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotSameDeliveryman)
    })

})