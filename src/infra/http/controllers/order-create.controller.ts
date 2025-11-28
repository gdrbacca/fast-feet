import { BadRequestException, Body, Controller, HttpCode, NotAcceptableException, Post, UnauthorizedException } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-type';
import { JWTSchemaType } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { OrderCreateUseCase } from '@/domain/fast_feet_main/application/use-cases/order-create';

export enum status {
    PENDING = 'PENDING',
    PICKED_UP = 'PICKED_UP',
    DELIVERED = 'DELIVERED',
    REFUND = 'REFUND'
}

const orderCreateBodySchema = z.object({
    description: z.string().min(3),
    recipientId: z.string(),
    status: z.enum(status),
    latitude: z.number(),
    longitude: z.number(),
})

type OrderCreateBodyType = z.infer<typeof orderCreateBodySchema>

@Controller()
export class OrderCreateController {

    constructor(private orderCreate: OrderCreateUseCase){}

    @Post("/order")
    @HttpCode(201)
    // @UseGuards(JwtAuthGuard)
    // @UsePipes(new ZodValidationPipe(registerUserBodySchema))
    async handle(
            @CurrentUser() user: JWTSchemaType, 
            @Body(new ZodValidationPipe(orderCreateBodySchema)) body: OrderCreateBodyType) 
    {
        const { description, recipientId, status, latitude, longitude } = body
        
        const {sub: user_id} = user
        //console.log(`User id: ${user_id}`)
        const result = await this.orderCreate.execute({
            id_sub: user_id,
            description,
            recipientId,
            status,
            latitude,
            longitude
        })

        if (result.isLeft()) {
            if (result.value.constructor.name === 'CreationNotAllowed') {
                throw new UnauthorizedException()
            }
            if (result.value.constructor.name === 'RecipientNotFound') {
                throw new NotAcceptableException()
            }
            throw new BadRequestException()
        }

        return {
            orderId: result.value.order.id.toString()
        }
    }
}
