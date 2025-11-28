import { BadRequestException, Body, Controller, HttpCode, NotAcceptableException, Param, Put, UnauthorizedException } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-type';
import { JWTSchemaType } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { OrderEditUseCase } from '@/domain/fast_feet_main/application/use-cases/order-edit';
import { GetOrdersPresenter } from './presenters/get-orders-presenter';

export enum status {
    PENDING = 'PENDING',
    PICKED_UP = 'PICKED_UP',
    DELIVERED = 'DELIVERED',
    REFUND = 'REFUND'
}

const orderEditParamSchema = z.object({
    orderId: z.uuid(),
})

const orderEditBodySchema = z.object({
    status: z.enum(status),
    description: z.string().min(3).optional(),
})

type OrderEditParamType = z.infer<typeof orderEditParamSchema>
type OrderEditBodyType = z.infer<typeof orderEditBodySchema>

@Controller()
export class OrderEditController {

    constructor(private orderEdit: OrderEditUseCase){}

    @Put("/order/:orderId")
    @HttpCode(201)
    // @UseGuards(JwtAuthGuard)
    // @UsePipes(new ZodValidationPipe(registerUserBodySchema))
    async handle(
            @CurrentUser() user: JWTSchemaType, 
            @Body(new ZodValidationPipe(orderEditBodySchema)) body: OrderEditBodyType,
            @Param(new ZodValidationPipe(orderEditParamSchema)) param: OrderEditParamType)
    {
        const { orderId } = param
        const { description, status } = body
        
        const {sub: user_id} = user
        //console.log(`User id: ${user_id}`)
        const result = await this.orderEdit.execute({
            id_sub: user_id,
            description,
            id_order: orderId,
            status
        })

        if (result.isLeft()) {
            if (result.value.constructor.name === 'EditNotAllowed') {
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
