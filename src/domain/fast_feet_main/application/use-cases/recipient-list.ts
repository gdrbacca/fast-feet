import { Either, left, right } from "@/core/either"
import { Recipient } from "../../enterprise/entities/recipient"
import { RecipientRepository } from "../repository/recipient-repository"
import { UserRepository } from "../repository/user-repository"
import { Injectable } from "@nestjs/common"
import { GetNotAllowed } from "@/core/errors/get-not-allowed"

interface recipientListUseCaseProps {
    id_sub: string
}

type recipientListUseCaseResponse = Either<
    GetNotAllowed,
    {recipients: Recipient[]}
>

@Injectable()
export class RecipientListUseCase {

    constructor(
        private userRepository: UserRepository,
        private recipientRepository: RecipientRepository
    ){}

    async execute({
        id_sub,
    }: recipientListUseCaseProps): Promise<recipientListUseCaseResponse> {
        const userFromSub = await this.userRepository.findById(id_sub)

        if (userFromSub?.role !== 'ADMIN') {
            return left(new GetNotAllowed())
        }

        const recipients = await this.recipientRepository.findMany()

        return right({recipients})
    }
}