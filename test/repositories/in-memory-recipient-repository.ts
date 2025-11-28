import { RecipientRepository } from "@/domain/fast_feet_main/application/repository/recipient-repository";
import { Recipient } from "@/domain/fast_feet_main/enterprise/entities/recipient";

export class InMemoryRecipientRepository implements RecipientRepository {
    public items: Recipient[] = [];
    
    async create(recipient: Recipient): Promise<void> {
        this.items.push(recipient)
    }

    async findById(recipientId: string): Promise<Recipient | null> {
        const recipient = this.items.find(recipient => {
            return recipient.id.toString() === recipientId
        })

        if (!recipient)
            return null

        return recipient
    }

    async save(recipient: Recipient): Promise<Recipient | null> {
        const index = this.items.findIndex(item => {
            return item.id.toString() === recipient.id.toString()
        })

        if (index === -1) {
            return null
        }

        this.items[index] = recipient

        return recipient
    }
    
    async delete(recipientId: string): Promise<void> {
        this.items = this.items.filter(item => {
            return item.id.toString() !== recipientId
        })
    }

    async findMany(): Promise<Recipient[]> {
        return this.items
    }
}