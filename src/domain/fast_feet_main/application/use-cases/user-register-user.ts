import { Either, left, right } from "@/core/either"
import { CreationNotAllowed } from "@/core/errors/creation-not-allowed"
import { User } from "../../enterprise/entities/user"
import { UserRepository } from "../repository/user-repository"
import { HashGenerator } from "../cryptography/hash-generator-and-compare"
import { Injectable } from "@nestjs/common"

interface RegisterUserUseCaseProps {
    id_sub: string
    name: string
    cpf: string
    password: string
    roleToRegister: 'ADMIN' | 'DELIVERYMAN'
}

type RegisterUserUseCaseResponse = Either<
    CreationNotAllowed,
    { user: User }
  >

@Injectable()
export class RegisterUserUseCase {

    constructor(
        private userRepository: UserRepository,
        private hashGenerator: HashGenerator
    ) {}

    async execute({
        id_sub,
        name,
        cpf,
        password,
        roleToRegister
    }: RegisterUserUseCaseProps): Promise<RegisterUserUseCaseResponse> {
        
        const userFromSub = await this.userRepository.findById(id_sub)
        // $2b$06$DITNh0iAFbaUZurk4j25KekY7FLRHJGzy7vjMHp3K00Zd6d4FxkHK
        if (userFromSub?.role !== 'ADMIN') {
            console.log('nmão é admin')
            return left(new CreationNotAllowed())
        }

        const userWithSameCpf = await this.userRepository.findByCpf(cpf)

        if (userWithSameCpf) {
            console.log('mesmo cpf')
            return left(new CreationNotAllowed())
        }

        const password_hash = await this.hashGenerator.generate(password)
        const user = User.create({
            name,
            cpf,
            password: password_hash,
            role: roleToRegister
        })
        
        await this.userRepository.create(user)

        return right({user})
    }
}