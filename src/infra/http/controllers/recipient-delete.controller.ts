import { BadRequestException, Controller, Delete, HttpCode, Param, UnauthorizedException } from '@nestjs/common';
import { JWTSchemaType } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { RecipientDeleteUseCase } from '@/domain/fast_feet_main/application/use-cases/recipient-delete';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-type';

const recipientDeleteParamSchema = z.object({
    recipientId: z.uuid()
})

type RecipientDeleteParamType = z.infer<typeof recipientDeleteParamSchema>

@Controller()
export class RecipientDeleteController {

    constructor(private recipientDelete: RecipientDeleteUseCase){}

    @Delete("/recipient/:recipientId")
    @HttpCode(204)
    // @UseGuards(JwtAuthGuard)
    // @UsePipes(new ZodValidationPipe(registerUserBodySchema))
    async handle(
        @CurrentUser() user: JWTSchemaType,
        @Param(new ZodValidationPipe(recipientDeleteParamSchema)) param: RecipientDeleteParamType
    )
    {
        const {sub: user_id} = user

        const { recipientId } = param

        console.log(`User id: ${user_id}`)
        const result = await this.recipientDelete.execute({
            id_sub: user_id,
            id_recipient: recipientId
        })

        if (result.isLeft()) {
            if (result.value.constructor.name === 'DeleteNotAllowed') {
                throw new UnauthorizedException()
            }
            throw new BadRequestException()
        }
    }
}
