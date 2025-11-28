import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Recipient } from "@/domain/fast_feet_main/enterprise/entities/recipient";
import { Recipient as PrismaRecipient, Prisma } from '@prisma/client'

export class PrismaRecipientMapper {

    static toDomain(raw: PrismaRecipient): Recipient {
        return Recipient.create({
            name: raw.name,
            address: raw.address,
            number: raw.number
        }, new UniqueEntityID(raw.id))
    }

    static toPrisma(raw: Recipient): Prisma.RecipientUncheckedCreateInput {
        return {
            id: raw.id.toString(),
            name: raw.name,
            address: raw.address,
            number: raw.number
        }
    }
}