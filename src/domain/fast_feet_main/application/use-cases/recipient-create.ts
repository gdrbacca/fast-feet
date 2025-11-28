import { Either, left, right } from "@/core/either"
import { CreationNotAllowed } from "@/core/errors/creation-not-allowed"
import { Recipient } from "../../enterprise/entities/recipient"
import { RecipientRepository } from "../repository/recipient-repository"
import { UserRepository } from "../repository/user-repository"
import { Injectable } from "@nestjs/common"

interface recipientCreateUseCaseProps {
    id_sub: string
    name: string
    address: string
    number: string
}

type recipientCreateUseCaseResponse = Either<
    CreationNotAllowed,
    {recipient: Recipient}
>

@Injectable()
export class RecipientCreateUseCase {

    constructor(
        private userRepository: UserRepository,
        private recipientRepository: RecipientRepository
    ){}

    async execute({
        id_sub,
        name,
        address,
        number
    }: recipientCreateUseCaseProps): Promise<recipientCreateUseCaseResponse> {
        const userFromSub = await this.userRepository.findById(id_sub)

        if (userFromSub?.role !== 'ADMIN') {
            return left(new CreationNotAllowed())
        }

        const recipient = Recipient.create({
            name,
            address,
            number
        })

        await this.recipientRepository.create(recipient)

        return right({recipient})
    }
}