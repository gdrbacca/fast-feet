import { BadRequestException, Controller, Get, HttpCode, UnauthorizedException } from '@nestjs/common';
import { JWTSchemaType } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { GetOrdersPresenter } from './presenters/get-orders-presenter';
import { OrderFindByUserUseCase } from '@/domain/fast_feet_main/application/use-cases/order-find-by-user';

@Controller()
export class OrderFindByUserController {

    constructor(private orderFindByUser: OrderFindByUserUseCase){}

    @Get("/order/deliveryman")
    @HttpCode(201)
    // @UseGuards(JwtAuthGuard)
    // @UsePipes(new ZodValidationPipe(registerUserBodySchema))
    async handle(
        @CurrentUser() user: JWTSchemaType,
    )
    {
        const {sub: user_id} = user

        //console.log(`User id: ${user_id}`)
        const result = await this.orderFindByUser.execute({
            id_sub: user_id,
        })

        if (result.isLeft()) {
            if (result.value.constructor.name === 'GetNotAllowed') {
                throw new UnauthorizedException()
            }
            throw new BadRequestException()
        }

        return {
            orders: GetOrdersPresenter.toHttpArray(result.value.orders)
        }
    }
}
