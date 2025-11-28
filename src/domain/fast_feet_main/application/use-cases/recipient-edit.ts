import { Either, left, right } from "@/core/either"
import { Recipient } from "../../enterprise/entities/recipient"
import { RecipientRepository } from "../repository/recipient-repository"
import { UserRepository } from "../repository/user-repository"
import { Injectable } from "@nestjs/common"
import { EditNotAllowed } from "@/core/errors/edit-not-allowed"
import { RecipientNotFound } from "@/core/errors/recipient-not-found"

interface recipientEditUseCaseProps {
    id_sub: string
    id_recipient: string
    name: string
    address: string
    number: string
}

type recipientEditUseCaseResponse = Either<
    EditNotAllowed | RecipientNotFound,
    {recipient: Recipient}
>

@Injectable()
export class RecipientEditUseCase {

    constructor(
        private userRepository: UserRepository,
        private recipientRepository: RecipientRepository
    ){}

    async execute({
        id_sub,
        id_recipient,
        name,
        address,
        number
    }: recipientEditUseCaseProps): Promise<recipientEditUseCaseResponse> {
        const userFromSub = await this.userRepository.findById(id_sub)

        if (userFromSub?.role !== 'ADMIN') {
            return left(new EditNotAllowed())
        }

        const recipient = await this.recipientRepository.findById(id_recipient)

        if (!recipient) {
            return left(new RecipientNotFound())
        }

        recipient.name = name
        recipient.address = address
        recipient.number = number

        await this.recipientRepository.save(recipient)

        return right({recipient})
    }
}