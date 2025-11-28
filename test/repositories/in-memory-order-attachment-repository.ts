import { OrderAttachmentRepository } from "@/domain/fast_feet_main/application/repository/order-attachment-repository";
import { OrderAttachment } from "@/domain/fast_feet_main/enterprise/entities/order-attachment";

export class InMemoryOrderAttachmentRepository implements OrderAttachmentRepository {
  public items: OrderAttachment[] = []

  async createMany(attachments: OrderAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: OrderAttachment[]): Promise<void> {
    this.items = this.items.filter((item) => {
      return !attachments.some((attachment) => {
        return attachment.equals(item)
      })
    })
  }

  async findManyByOrderId(id: string) {
    const orderAttachments = this.items.filter(
      (item) => item.orderId.toString() === id.toString(),
    )

    return orderAttachments
  }

  async deleteManyByOrderId(orderId: string) {
    const orderAttachments = this.items.filter(
      (item) => item.orderId.toString() !== orderId.toString(),
    )

    this.items = orderAttachments
  }
}