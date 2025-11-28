import { PrismaService } from "../prisma.service";
import { Recipient } from "@/domain/fast_feet_main/enterprise/entities/recipient";
import { RecipientRepository } from "@/domain/fast_feet_main/application/repository/recipient-repository";
import { PrismaRecipientMapper } from "./mapppers/recipient-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaRecipientRepository implements RecipientRepository {
    constructor(private prisma: PrismaService) {}
     
    async create(recipient: Recipient): Promise<void> {
        await this.prisma.recipient.create({
            data: PrismaRecipientMapper.toPrisma(recipient)
        })
    }

    async findById(recipientId: string): Promise<Recipient | null> {
        const recipient = await this.prisma.recipient.findUnique({
            where: {
                id: recipientId
            }
        })

        if (!recipient)
            return null

        return PrismaRecipientMapper.toDomain(recipient)
    }

    async save(recipient: Recipient): Promise<Recipient | null> {
        const recipientEdited = await this.prisma.recipient.update({
            where: {
                id: recipient.id.toString()
            },
            data: PrismaRecipientMapper.toPrisma(recipient)
        })

        return PrismaRecipientMapper.toDomain(recipientEdited)
    }

    async delete(recipientId: string): Promise<void> {
        await this.prisma.recipient.delete({
            where: {
                id: recipientId
            }
        })
    }

    async findMany(): Promise<Recipient[]> {
        const recipients = await this.prisma.recipient.findMany()

        return recipients.map(item => {
            return Recipient.create({
                name: item.name,
                address: item.address,
                number: item.number
            })
        })
    }

}