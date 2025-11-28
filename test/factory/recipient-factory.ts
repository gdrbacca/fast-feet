import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Recipient, RecipientProps } from "@/domain/fast_feet_main/enterprise/entities/recipient";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaRecipientMapper } from "@/infra/database/prisma/repositories/mapppers/recipient-mapper";
import { Injectable } from "@nestjs/common";

export function makeRecipient(override: Partial<RecipientProps> = {}, id?: UniqueEntityID): Recipient {
    const user = Recipient.create({
        name: 'John Doe',
        address: 'Grove Street',
        number: '123',
        ...override
    }, id)

    return user
}

@Injectable()
export class MakeRecipient {
    constructor(private prisma: PrismaService){}

    async create(override: Partial<RecipientProps> = {}): Promise<Recipient> {
        const recipient = makeRecipient(override)

        await this.prisma.recipient.create({
            data: PrismaRecipientMapper.toPrisma(recipient)
        })

        return recipient
    }
}