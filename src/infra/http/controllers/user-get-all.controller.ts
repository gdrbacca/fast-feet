import { GetUserUseCase } from "@/domain/fast_feet_main/application/use-cases/user-get-user";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JWTSchemaType } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Get, HttpCode, UnauthorizedException } from "@nestjs/common";
import { GetUserPresenter } from "./presenters/get-user-presenter";


@Controller()
export class GetUserController {

    constructor(private getUser: GetUserUseCase){}

    @Get('/user')
    @HttpCode(200)
    async handle(@CurrentUser() user: JWTSchemaType) {
        const {sub: user_id} = user

        const result = await this.getUser.execute({
            id_sub: user_id
        })

        if (result.isLeft()) {
            if (result.value.constructor.name === 'GetNotAllowed'){
                throw new UnauthorizedException()
            }

            throw new BadRequestException()
        }

        return GetUserPresenter.toHttpArray(result.value.users)
    }
}