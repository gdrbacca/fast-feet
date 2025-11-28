import { BadRequestException, Body, Controller, HttpCode, NotAcceptableException, Param, Put, UnauthorizedException } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-type';
import { JWTSchemaType } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { GetOrdersPresenter } from './presenters/get-orders-presenter';
import { OrderChangeStatusUseCase } from '@/domain/fast_feet_main/application/use-cases/order-change-status';

export enum status {
    PENDING = 'PENDING',
    PICKED_UP = 'PICKED_UP',
    DELIVERED = 'DELIVERED',
    REFUND = 'REFUND'
}

const orderChangeStatusParamSchema = z.object({
    orderId: z.uuid(),
})

const orderChangeStatusBodySchema = z.object({
    status: z.enum(status),
})

type OrderChangeStatusParamType = z.infer<typeof orderChangeStatusParamSchema>
type OrderChangeStatusBodyType = z.infer<typeof orderChangeStatusBodySchema>

@Controller()
export class OrderChangeStatusController {

    constructor(private orderChangeStatus: OrderChangeStatusUseCase){}

    @Put("/order/status/:orderId")
    @HttpCode(201)
    // @UseGuards(JwtAuthGuard)
    // @UsePipes(new ZodValidationPipe(registerUserBodySchema))
    async handle(
            @CurrentUser() user: JWTSchemaType, 
            @Body(new ZodValidationPipe(orderChangeStatusBodySchema)) body: OrderChangeStatusBodyType,
            @Param(new ZodValidationPipe(orderChangeStatusParamSchema)) param: OrderChangeStatusParamType)
    {
        const { orderId } = param
        const { status } = body
        
        const {sub: user_id} = user
        //console.log(`User id: ${user_id}`)
        const result = await this.orderChangeStatus.execute({
            id_sub: user_id,
            id_order: orderId,
            status
        })

        if (result.isLeft()) {
            if (result.value.constructor.name === 'ChangeStatusNotAllowed') {
                throw new UnauthorizedException()
            }
            if (result.value.constructor.name === 'OrderNotFound') {
                throw new NotAcceptableException()
            }
            throw new BadRequestException()
        }

        return GetOrdersPresenter.toHttp(result.value.order)
    }
}
