import { Either, left, right } from "@/core/either";
import { UserRepository } from "../repository/user-repository";
import { GetNotAllowed } from "@/core/errors/get-not-allowed";
import { User } from "../../enterprise/entities/user";
import { Injectable } from "@nestjs/common";

interface getUserRequest {
    id_sub: string
}

type getUserResponse = Either<
    GetNotAllowed,
    {users: User[]}
>

@Injectable()
export class GetUserUseCase {
    constructor(private userRepository: UserRepository){}

    async execute({id_sub}: getUserRequest): Promise<getUserResponse>{
        const userFromSub = await this.userRepository.findById(id_sub)

        if (!userFromSub) {
            return left(new GetNotAllowed())
        }

        const users = await this.userRepository.findAll()

        return right({users})
    }
}