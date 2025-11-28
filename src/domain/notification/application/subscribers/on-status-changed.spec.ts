import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository"
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository"
import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { MockInstance } from "vitest"
import { SendNotificationUseCase } from "../use-cases/send-notification"
import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository"
import { OnStatusChanged } from "./on-status-changed"
import { makeUser } from "test/factory/user-factory"
import { makeRecipient } from "test/factory/recipient-factory"
import { makeOrder } from "test/factory/order-factory"
import { waitFor } from "test/utils/wait-for"
import { InMemoryOrderAttachmentRepository } from "test/repositories/in-memory-order-attachment-repository"

let sendNotificationExecuteSpy: MockInstance
let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryUserRepository: InMemoryUserRepository
let inMemoryNotificationRepository: InMemoryNotificationRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let sendNotificationUseCase: SendNotificationUseCase

describe("On status changed", () => {
    beforeEach(() => {
        inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
        inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderAttachmentRepository)
        inMemoryUserRepository = new InMemoryUserRepository()
        inMemoryRecipientRepository = new InMemoryRecipientRepository()
        inMemoryNotificationRepository = new InMemoryNotificationRepository()
        sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationRepository)

        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

        new OnStatusChanged(inMemoryRecipientRepository, sendNotificationUseCase)
    })

    it("should be able to notify the recipient when an order change its status", async () => {
        const user = makeUser({
            cpf: '06665763943',
            role: 'ADMIN'
        })

        const user2 = makeUser({
            cpf: '06665763944',
            role: 'DELIVERYMAN'
        })

        const recipient = makeRecipient({
            name: 'Clovis'
        })

        const order = makeOrder({
            description: 'Order 1',
            status: 'PENDING',
            userId: user.id,
            recipientId: recipient.id,
            latitude: -26.8921359,
            longitude: -49.005693
        })

        inMemoryUserRepository.create(user)
        inMemoryUserRepository.create(user2)
        inMemoryRecipientRepository.create(recipient)
        inMemoryOrderRepository.create(order)

        order.status = "PICKED_UP"

        inMemoryOrderRepository.changeStatus(
            order.id.toString(), user2.id.toString(), order
        )
        

        await waitFor(() => {
		  expect(sendNotificationExecuteSpy).toHaveBeenCalled()
		})

    })

})