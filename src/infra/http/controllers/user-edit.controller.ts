import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { JWTSchemaType } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, HttpCode, Patch, UnauthorizedException } from "@nestjs/common";
import { GetUserPresenter } from "./presenters/get-user-presenter";
import { UserEditUseCase } from "@/domain/fast_feet_main/application/use-cases/user-edit";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-type";
import { roles } from "./user-register.controller";
import { makeUser } from "test/factory/user-factory";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

const userEditBodySchema = z.object({
    id_user: z.uuid(),
    name: z.string(),
    cpf: z.string(),
    password: z.string().min(6),
    role: z.enum(roles)
})

type UserEditBodyType = z.infer<typeof userEditBodySchema>

@Controller()
export class UserEditController {

    constructor(private userEdit: UserEditUseCase){}

    @Patch('/user')
    @HttpCode(201)
    async handle(
        @CurrentUser() user: JWTSchemaType, 
        @Body(new ZodValidationPipe(userEditBodySchema)) body: UserEditBodyType
    ) {
        const {sub: user_id} = user

        const {id_user, name, cpf, password, role} = body
        const edited_user = makeUser({
            name,
            cpf,
            password, 
            role
        }, new UniqueEntityID(id_user))

        const result = await this.userEdit.execute({
            id_sub: user_id,
            id_user,
            user: edited_user
        })

        if (result.isLeft()) {
            if (result.value.constructor.name === 'GetNotAllowed'){
                throw new UnauthorizedException()
            }

            throw new BadRequestException()
        }

        return GetUserPresenter.toHttp(result.value.user)
    }
}