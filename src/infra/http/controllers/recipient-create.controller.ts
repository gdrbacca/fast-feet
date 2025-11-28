import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-type';
import { JWTSchemaType } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { RecipientCreateUseCase } from '@/domain/fast_feet_main/application/use-cases/recipient-create';


const recipientCreateBodySchema = z.object({
    name: z.string().min(3),
    address: z.string(),
    number: z.string(),
})

type RecipientCreateBodyType = z.infer<typeof recipientCreateBodySchema>

@Controller()
export class RecipientCreateController {

    constructor(private recipientCreate: RecipientCreateUseCase){}

    @Post("/recipient")
    @HttpCode(201)
    // @UseGuards(JwtAuthGuard)
    // @UsePipes(new ZodValidationPipe(registerUserBodySchema))
    async handle(
            @CurrentUser() user: JWTSchemaType, 
            @Body(new ZodValidationPipe(recipientCreateBodySchema)) body: RecipientCreateBodyType) 
    {
        const { name, address, number } = body
        
        const {sub: user_id} = user
        console.log(`User id: ${user_id}`)
        const result = await this.recipientCreate.execute({
            id_sub: user_id,
            name,
            address,
            number
        })

        if (result.isLeft()) {
            if (result.value.constructor.name === 'CreationNotAllowed') {
                throw new UnauthorizedException()
            }
            throw new BadRequestException()
        }

        return {
            recipient: result.value
        }
    }
}
