import { BadRequestException, Controller, Get, HttpCode, UnauthorizedException } from '@nestjs/common';
import { JWTSchemaType } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { RecipientListUseCase } from '@/domain/fast_feet_main/application/use-cases/recipient-list';
import { RecipientPresenter } from './presenters/get-recipient-presenter';

@Controller()
export class RecipientListController {

    constructor(private recipientList: RecipientListUseCase){}

    @Get("/recipient")
    @HttpCode(201)
    // @UseGuards(JwtAuthGuard)
    // @UsePipes(new ZodValidationPipe(registerUserBodySchema))
    async handle(@CurrentUser() user: JWTSchemaType)
    {
        const {sub: user_id} = user

        console.log(`User id: ${user_id}`)
        const result = await this.recipientList.execute({
            id_sub: user_id,
        })

        if (result.isLeft()) {
            if (result.value.constructor.name === 'GetNotAllowed') {
                throw new UnauthorizedException()
            }
            throw new BadRequestException()
        }
        console.log('result value')
        console.log(result.value)

        return {
            recipients: RecipientPresenter.toHttpArray(result.value.recipients)
        }
    }
}
