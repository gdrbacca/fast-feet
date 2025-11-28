import { Either, left, right } from "@/core/either"
import { RecipientRepository } from "../repository/recipient-repository"
import { UserRepository } from "../repository/user-repository"
import { Injectable } from "@nestjs/common"
import { DeleteNotAllowed } from "@/core/errors/delete-not-allowed"

interface recipientDeleteUseCaseProps {
    id_sub: string
    id_recipient: string
}

type recipientDeleteUseCaseResponse = Either<
    DeleteNotAllowed,
    {}
>

@Injectable()
export class RecipientDeleteUseCase {

    constructor(
        private userRepository: UserRepository,
        private recipientRepository: RecipientRepository
    ){}

    async execute({
        id_sub,
        id_recipient
    }: recipientDeleteUseCaseProps): Promise<recipientDeleteUseCaseResponse> {
        const userFromSub = await this.userRepository.findById(id_sub)

        if (userFromSub?.role !== 'ADMIN') {
            return left(new DeleteNotAllowed())
        }

        await this.recipientRepository.delete(id_recipient)

        return right({})
    }
}