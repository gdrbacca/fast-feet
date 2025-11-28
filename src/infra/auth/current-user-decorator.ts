import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JWTSchemaType } from "./jwt.strategy";

export const CurrentUser = createParamDecorator(
    (_:never, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();

        //.user is from Nest
        return request.user as JWTSchemaType
    }
)