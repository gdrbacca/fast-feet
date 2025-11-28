import { BadRequestException, Controller, Get, HttpCode, UnauthorizedException } from '@nestjs/common';
import { JWTSchemaType } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { OrderListUseCase } from '@/domain/fast_feet_main/application/use-cases/order-list';
import { GetOrdersPresenter } from './presenters/get-orders-presenter';


@Controller()
export class OrderListController {

    constructor(private orderList: OrderListUseCase){}

    @Get("/order")
    @HttpCode(201)
    // @UseGuards(JwtAuthGuard)
    // @UsePipes(new ZodValidationPipe(registerUserBodySchema))
    async handle(@CurrentUser() user: JWTSchemaType)
    {
        const {sub: user_id} = user
        //console.log(`User id: ${user_id}`)
        const result = await this.orderList.execute({
            id_sub: user_id,
        })

        if (result.isLeft()) {
            if (result.value.constructor.name === 'GetNotAllowed') {
                throw new UnauthorizedException()
            }
            throw new BadRequestException()
        }

        return {
            orders: GetOrdersPresenter.toHttpArrayOnlyOrder(result.value.orders)
        }
    }
}
