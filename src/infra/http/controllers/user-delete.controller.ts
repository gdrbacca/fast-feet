import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JWTSchemaType } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Delete, HttpCode, Param, UnauthorizedException } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-type";
import { UserDeleteUseCase } from "@/domain/fast_feet_main/application/use-cases/user-delete";

const userDeleteParamSchema = z.object({
    userId: z.uuid(),
})

type UserDeletePAramType = z.infer<typeof userDeleteParamSchema>

@Controller()
export class UserDeleteController {

    constructor(private userDelete: UserDeleteUseCase){}

    @Delete('/user/:userId')
    @HttpCode(204)
    async handle(
        @CurrentUser() user: JWTSchemaType, 
        @Param(new ZodValidationPipe(userDeleteParamSchema)) param: UserDeletePAramType
    ) {
        const {sub: user_id} = user

        const {userId} = param

        const result = await this.userDelete.execute({
            id_sub: user_id,
            id_user: userId,
        })

        if (result.isLeft()) {
            if (result.value.constructor.name === 'GetNotAllowed'){
                throw new UnauthorizedException()
            }

            throw new BadRequestException()
        }

        return result.value
    }
}