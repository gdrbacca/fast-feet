import { Either, left, right } from "@/core/either"
import { UserRepository } from "../repository/user-repository"
import { HashCompare } from "../cryptography/hash-generator-and-compare"
import { WrongCredentialsError } from "@/core/errors/wrong-credentials"
import { Encrypter } from "../cryptography/encrypt"
import { Injectable } from "@nestjs/common"

interface AuthenticateUseCaseProps {
    cpf: string
    password: string
}

type AuthenticateUseCaseResponse = Either<
    WrongCredentialsError,
    { access_token: string }
  >

@Injectable()
export class AuthenticateUseCase {

    constructor(
        private userRepository: UserRepository,
        private hashCompare: HashCompare,
        private jwtEncrypter: Encrypter
    ) {}

    async execute({
        cpf,
        password,
    }: AuthenticateUseCaseProps): Promise<AuthenticateUseCaseResponse> {        
        const user = await this.userRepository.findByCpf(cpf)

        if (!user) {
            return left(new WrongCredentialsError())
        }

        const password_match = await this.hashCompare.compare(password, user.password)

        if (!password_match) {
            return left(new WrongCredentialsError())
        }
        console.log('user id')
        console.log(user)
        const access_token = await this.jwtEncrypter.encrypt({ sub: user.id.toString() })
        

        return right({access_token})
    }
}