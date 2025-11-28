import { User } from "../../enterprise/entities/user";

export abstract class UserRepository {
    abstract create(user: User): Promise<void>
    abstract findByCpf(cpf: string): Promise<User | null>
    abstract findById(id: string): Promise<User | null>
    abstract findAll(): Promise<User[]>
    abstract edit(user_id: string, user: User): Promise<User | null>
    abstract delete(user_id: string): Promise<void>
}