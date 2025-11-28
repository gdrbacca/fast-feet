import { BadRequestException, Body, Controller, Delete, HttpCode, NotAcceptableException, Param, Put, UnauthorizedException } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-type';
import { JWTSchemaType } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { OrderDeleteUseCase } from '@/domain/fast_feet_main/application/use-cases/order-delete';


const orderDeleteParamSchema = z.object({
    orderId: z.uuid(),
})


type OrderDeleteParamType = z.infer<typeof orderDeleteParamSchema>

@Controller()
export class OrderDeleteController {

    constructor(private orderDelete: OrderDeleteUseCase){}

    @Delete("/orders/:orderId")
    @HttpCode(204)
    // @UseGuards(JwtAuthGuard)
    // @UsePipes(new ZodValidationPipe(registerUserBodySchema))
    async handle(
            @CurrentUser() user: JWTSchemaType, 
            @Param(new ZodValidationPipe(orderDeleteParamSchema)) param: OrderDeleteParamType)
    {
        const { orderId } = param
        
        const {sub: user_id} = user
        //console.log(`User id: ${user_id}`)
        const result = await this.orderDelete.execute({
            id_sub: user_id,
            id_order: orderId,
        })

        if (result.isLeft()) {
            if (result.value.constructor.name === 'DeleteNotAllowed') {
                throw new UnauthorizedException()
            }
            if (result.value.constructor.name === 'OrderNotFound') {
                throw new NotAcceptableException()
            }
            throw new BadRequestException()
        }

    }
}
