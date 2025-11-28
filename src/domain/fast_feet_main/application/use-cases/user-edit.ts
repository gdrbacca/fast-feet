import { Either, left, right } from "@/core/either";
import { UserRepository } from "../repository/user-repository";
import { GetNotAllowed } from "@/core/errors/get-not-allowed";
import { User } from "../../enterprise/entities/user";
import { Injectable } from "@nestjs/common";
import { HashGenerator } from "../cryptography/hash-generator-and-compare";

interface userEditRequest {
    id_sub: string
    id_user: string
    user: User
}

type userEditResponse = Either<
    GetNotAllowed,
    {user: User}
>

@Injectable()
export class UserEditUseCase {
    constructor(private userRepository: UserRepository, private hasher: HashGenerator){}

    async execute({ id_sub, id_user, user }: userEditRequest): Promise<userEditResponse>{
        const userFromSub = await this.userRepository.findById(id_sub)

        if (!userFromSub) {
            return left(new GetNotAllowed())
        }

        const password_hash = await this.hasher.generate(user.password)
        user.password = password_hash

        const user_edited = await this.userRepository.edit(id_user, user)

        if (!user_edited) {
            return left(new GetNotAllowed())
        }
        
        return right({user: user_edited})
    }
}