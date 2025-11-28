import { UserRepository } from "@/domain/fast_feet_main/application/repository/user-repository";
import { User } from "@/domain/fast_feet_main/enterprise/entities/user";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaUserMapper } from "./mapppers/user-mapper";

@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private prisma: PrismaService){}
    

    async create(user: User): Promise<void> {
        const data = PrismaUserMapper.toPrisma(user)
        await this.prisma.user.create({
            data 
        })
    }
    async findByCpf(cpf: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                cpf
            }
        })

        if (!user)
            return null

        return PrismaUserMapper.toDomain(user)
    }
    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        })

        if (!user)
            return null

        return PrismaUserMapper.toDomain(user)
    }

    async findAll(): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            where: {
                role: 'DELIVERYMAN'
            }
        })

        return users.map(PrismaUserMapper.toDomain)
    }

    async edit(user_id: string, user: User): Promise<User> {
        const user_updated = PrismaUserMapper.toPrisma(user)
        const user_changed = await this.prisma.user.update({
            where: {
                id: user_id
            },
            data: user_updated
        })

        return PrismaUserMapper.toDomain(user_changed)
    }

    async delete(user_id: string): Promise<void> {
        await this.prisma.user.delete({
            where: {
                id: user_id
            }
        })
    }
}