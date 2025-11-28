import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User } from "@/domain/fast_feet_main/enterprise/entities/user";
import { User as PrismaUser, Prisma } from '@prisma/client'

export class PrismaUserMapper {

    static toDomain(raw: PrismaUser): User {
        return User.create({
            name: raw.name,
            cpf: raw.cpf,
            password: raw.password,
            role: raw.role
        }, new UniqueEntityID(raw.id))
    }

    static toPrisma(raw: User): Prisma.UserUncheckedCreateInput {
        return {
            id: raw.id.toString(),
            name: raw.name,
            cpf: raw.cpf,
            password: raw.password,
            role: raw.role
        }
    }
}