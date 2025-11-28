import { RegisterUserUseCase } from '@/domain/fast_feet_main/application/use-cases/user-register-user';
import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UseGuards, UsePipes } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-type';
import { JWTSchemaType } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';

export enum roles {
    ADMIN = 'ADMIN',
    DELIVERYMAN = 'DELIVERYMAN'
}

const registerUserBodySchema = z.object({
    name: z.string().min(3),
    cpf: z.string(),
    password: z.string(),
    roleToRegister: z.enum(roles)
})

type RegisterUserBodyType = z.infer<typeof registerUserBodySchema>

@Controller()
export class RegisterUserController {

    constructor(private registerUser: RegisterUserUseCase){}

    @Post("/user")
    @HttpCode(201)
    // @UseGuards(JwtAuthGuard)
    // @UsePipes(new ZodValidationPipe(registerUserBodySchema))
    async handler(
            @CurrentUser() user: JWTSchemaType, 
            @Body(new ZodValidationPipe(registerUserBodySchema)) body: RegisterUserBodyType) 
    {
        const { name, cpf, password, roleToRegister } = body
        
        const {sub: user_id} = user
        //console.log(`User id: ${user_id}`)
        const result = await this.registerUser.execute({
            id_sub: user_id,
            name,
            cpf,
            password,
            roleToRegister
        })

        if (result.isLeft()) {
            if (result.value.constructor.name === 'CreationNotAllowed') {
                throw new UnauthorizedException()
            }
            throw new BadRequestException()
        }

        return {
            message: 'User created'
        }
    }
}
