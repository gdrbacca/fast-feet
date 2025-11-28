import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserProps } from "@/domain/fast_feet_main/enterprise/entities/user";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaUserMapper } from "@/infra/database/prisma/repositories/mapppers/user-mapper";
import { Injectable } from "@nestjs/common";

export function makeUser(override: Partial<UserProps> = {}, id?: UniqueEntityID): User {
    const user = User.create({
        name: 'John Doe',
        cpf: '12365498743',
        password: '123456-hashed',
        role: 'ADMIN',
        ...override
    }, id)

    return user
}

@Injectable()
export class MakeUser {
    constructor(private prisma: PrismaService){}

    async create(override: Partial<UserProps> = {}): Promise<User> {
        const user = makeUser(override)

        await this.prisma.user.create({
            data: PrismaUserMapper.toPrisma(user)
        })

        return user
    }
}