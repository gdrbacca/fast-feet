import { BadRequestException, Body, Controller, HttpCode, NotAcceptableException, Param, Post, UnauthorizedException } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-type';
import { JWTSchemaType } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { RecipientEditUseCase } from '@/domain/fast_feet_main/application/use-cases/recipient-edit';


const recipientEditBodySchema = z.object({
    name: z.string().min(3),
    address: z.string(),
    number: z.string(),
})

const recipientEditParamSchema = z.object({
    recipientId: z.uuid()
})

type RecipientEditBodyType = z.infer<typeof recipientEditBodySchema>

type RecipientEditParamType = z.infer<typeof recipientEditParamSchema>

@Controller()
export class RecipientEditController {

    constructor(private recipientEdit: RecipientEditUseCase){}

    @Post("/recipient/:recipientId")
    @HttpCode(201)
    // @UseGuards(JwtAuthGuard)
    // @UsePipes(new ZodValidationPipe(registerUserBodySchema))
    async handle(
            @CurrentUser() user: JWTSchemaType, 
            @Body(new ZodValidationPipe(recipientEditBodySchema)) body: RecipientEditBodyType,
            @Param(new ZodValidationPipe(recipientEditParamSchema)) param: RecipientEditParamType) 
    {
        const { name, address, number } = body
        const { recipientId } = param

        const {sub: user_id} = user

        console.log(`User id: ${user_id}`)
        const result = await this.recipientEdit.execute({
            id_sub: user_id,
            id_recipient: recipientId,
            name,
            address,
            number
        })

        if (result.isLeft()) {
            if (result.value.constructor.name === 'EditNotAllowed') {
                throw new UnauthorizedException()
            }
            if (result.value.constructor.name === 'RecipientNotFound') {
                throw new NotAcceptableException()
            }
            throw new BadRequestException()
        }

        return {
            recipient: result.value
        }
    }
}
