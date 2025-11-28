import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Env } from "../env/env";
import z from "zod";
import { Injectable } from "@nestjs/common";

const jwtSchema = z.object({
    sub: z.string() // uuid()
})

export type JWTSchemaType = z.infer<typeof jwtSchema>

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService<Env, true>){
        const publicKey = config.get("JWT_PUBLIC_KEY", { infer: true })
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: Buffer.from(publicKey, 'base64'),
            algorithms: ['RS256']
        });
    }

    async validate(payload: JWTSchemaType) {
        return jwtSchema.parse(payload)
    }

}