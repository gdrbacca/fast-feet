import { BadRequestException, Body, Controller, HttpCode, NotAcceptableException, Param, Put, UnauthorizedException } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-type';
import { JWTSchemaType } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { GetOrdersPresenter } from './presenters/get-orders-presenter';
import { OrderEditWithAttachmentUseCase } from '@/domain/fast_feet_main/application/use-cases/order-edit-with-attachment';

const orderEditParamSchema = z.object({
    orderId: z.uuid(),
})

const orderEditBodySchema = z.object({
    attachments: z.string().array(),
})

type OrderEditWithAttachmentParamType = z.infer<typeof orderEditParamSchema>
type OrderEditWithAttachmentBodyType = z.infer<typeof orderEditBodySchema>

@Controller()
export class OrderEditWithAttachmentController {

    constructor(private orderEditWithAttachment: OrderEditWithAttachmentUseCase){}

    @Put("/order/attachment/:orderId")
    @HttpCode(201)
    // @UseGuards(JwtAuthGuard)
    // @UsePipes(new ZodValidationPipe(registerUserBodySchema))
    async handle(
            @CurrentUser() user: JWTSchemaType, 
            @Body(new ZodValidationPipe(orderEditBodySchema)) body: OrderEditWithAttachmentBodyType,
            @Param(new ZodValidationPipe(orderEditParamSchema)) param: OrderEditWithAttachmentParamType)
    {
        const { orderId } = param
        const { attachments } = body
        
        const {sub: user_id} = user
        console.log(`User id: ${user_id}`)
        const result = await this.orderEditWithAttachment.execute({
            id_sub: user_id,
            id_order: orderId,
            attachments
        })

        if (result.isLeft()) {
            if (result.value.constructor.name === 'EditOrderWithAttachmentNotAllowed'
                || result.value.constructor.name === 'NotSameDeliveryman'
            ) {
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
