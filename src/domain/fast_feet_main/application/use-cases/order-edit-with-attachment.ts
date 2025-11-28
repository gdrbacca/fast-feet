import { Either, left, right } from "@/core/either"
import { UserRepository } from "../repository/user-repository"
import { Injectable } from "@nestjs/common"
import { Order } from "../../enterprise/entities/order"
import { OrderRepository } from "../repository/order-repository"
import { OrderNotFound } from "@/core/errors/order-not-found"
import { OrderAttachmentList } from "../../enterprise/entities/attachment-list"
import { OrderAttachment } from "../../enterprise/entities/order-attachment"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { EditOrderWithAttachmentNotAllowed } from "@/core/errors/edit-order-with-attachment-not-alowed"
import { OrderDeliverymanRepository } from "../repository/order-deliveryman-repository"
import { NotSameDeliveryman } from "@/core/errors/not-same-deliveryman"

interface OrderEditWithAttachmentUseCaseProps {
    id_sub: string
    id_order: string
    attachments: string[]
}

type OrderEditWithAttachmentUseCaseResponse = Either<
    EditOrderWithAttachmentNotAllowed | OrderNotFound | NotSameDeliveryman,
    { order: Order }
  >

@Injectable()
export class OrderEditWithAttachmentUseCase {

    constructor(
        private orderRepository: OrderRepository,
        private userRepository: UserRepository,
        private orderDeliverymanRepository: OrderDeliverymanRepository
    ) {}

    async execute({
        id_sub,
        id_order,
        attachments
    }: OrderEditWithAttachmentUseCaseProps): Promise<OrderEditWithAttachmentUseCaseResponse> {
        const userFromSub = await this.userRepository.findById(id_sub)

        if (!userFromSub) {
            return left(new EditOrderWithAttachmentNotAllowed())
        }

        const order_edit = await this.orderRepository.findById(id_order)
        
        if (!order_edit) {
            console.log('order not found 1')
            return left(new OrderNotFound())
        }

        const orderWithDeliveryman = await this.orderDeliverymanRepository.findByUserAndOrderId(id_sub, id_order)

        if (!orderWithDeliveryman || 
            orderWithDeliveryman.deliverymanId.toString() !== id_sub) {
                console.log('not same deliveryman')
                return left(new NotSameDeliveryman())
            }

        order_edit.status = 'DELIVERED'

        const orderAttachments = attachments.map(item => {
            return OrderAttachment.create({
                orderId: order_edit.id,
                attachmentId: new UniqueEntityID(item)
            })
        })
        const orderAttachmentList = new OrderAttachmentList(orderAttachments)
        order_edit.attachments = orderAttachmentList

        const order = await this.orderRepository.edit(id_order, order_edit)

        if (!order) {
            console.log('order not found 2')
            return left(new OrderNotFound())
        }


        return right({order})
    }
}