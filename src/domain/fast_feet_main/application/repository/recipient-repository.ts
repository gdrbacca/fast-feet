import { Recipient } from "../../enterprise/entities/recipient";

export abstract class RecipientRepository {
    abstract create(recipient: Recipient): Promise<void>
    abstract findById(recipientId: string): Promise<Recipient | null>
    abstract findMany(): Promise<Recipient[]>
    abstract save(recipient: Recipient): Promise<Recipient | null>
    abstract delete(recipientId: string): Promise<void>
}