import { Either, left, right } from "@/core/either";
import { UserRepository } from "../repository/user-repository";
import { GetNotAllowed } from "@/core/errors/get-not-allowed";
import { Injectable } from "@nestjs/common";

interface userDeleteRequest {
    id_sub: string
    id_user: string
}

type userDeleteResponse = Either<
    GetNotAllowed,
    'Ok'
>

@Injectable()
export class UserDeleteUseCase {
    constructor(private userRepository: UserRepository){}

    async execute({ id_sub, id_user }: userDeleteRequest): Promise<userDeleteResponse>{
        const userFromSub = await this.userRepository.findById(id_sub)

        if (!userFromSub) {
            return left(new GetNotAllowed())
        }

        await this.userRepository.delete(id_user)

        
        return right('Ok')
    }
}