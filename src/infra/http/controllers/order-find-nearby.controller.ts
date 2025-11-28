import { BadRequestException, Body, Controller, Get, HttpCode, UnauthorizedException } from '@nestjs/common';
import { JWTSchemaType } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { GetOrdersPresenter } from './presenters/get-orders-presenter';
import { OrderFindNearbyUseCase } from '@/domain/fast_feet_main/application/use-cases/order-find-nearby';
import z from 'zod';

const orderFindNearbyBodySchema = z.object({
    latitude: z.number(),
    longitude: z.number()
})

type OrderFindNearbyBodyType = z.infer<typeof orderFindNearbyBodySchema>

@Controller()
export class OrderFindNearbyController {

    constructor(private orderFindNearby: OrderFindNearbyUseCase){}

    @Get("/order/nearby")
    @HttpCode(201)
    // @UseGuards(JwtAuthGuard)
    // @UsePipes(new ZodValidationPipe(registerUserBodySchema))
    async handle(
        @CurrentUser() user: JWTSchemaType,
        @Body() body: OrderFindNearbyBodyType
    )
    {
        const {sub: user_id} = user
        const {latitude, longitude} = body
        //console.log(`User id: ${user_id}`)
        const result = await this.orderFindNearby.execute({
            id_sub: user_id,
            latitude,
            longitude
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
