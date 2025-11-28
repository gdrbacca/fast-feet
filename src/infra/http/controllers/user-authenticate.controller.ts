import { AuthenticateUseCase } from "@/domain/fast_feet_main/application/use-cases/user-authenticate";
import { BadRequestException, Body, Controller, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-type";
import { Public } from "@/infra/auth/public";

const authenticateBodySchema = z.object({
    cpf: z.string(),
    password: z.string()
})

type AuthenticateBodyType = z.infer<typeof authenticateBodySchema>

@Controller()
export class AuthenticateController {
    constructor(private authenticateUseCase: AuthenticateUseCase){}

    @Post("/session")
    @Public()
    @UsePipes(new ZodValidationPipe(authenticateBodySchema))
    async handle(@Body() body: AuthenticateBodyType) {
        const { cpf, password } = body

        const result = await this.authenticateUseCase.execute({
            cpf,
            password
        })

        if (result.isLeft()){
            if (result.value.constructor.name === "WrongCredentialsError") {
                throw new UnauthorizedException(result.value.message)
            }

            throw new BadRequestException(result.value.message)
        }

        const { access_token } = result.value
        // console.log(access_token)

        return {
            access_token
        }
    }
}