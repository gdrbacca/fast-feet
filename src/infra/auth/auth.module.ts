import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { EnvService } from "../env/env.service";
import { EnvModule } from "../env/env.module";
import { JWTStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [EnvService],
            global: true,
            imports: [EnvModule],
            useFactory(env: EnvService){
                const public_key = env.get("JWT_PUBLIC_KEY")
                const private_key = env.get("JWT_PRIVATE_KEY")
                return{
                    publicKey: Buffer.from(public_key, 'base64'),
                    privateKey: Buffer.from(private_key, 'base64'),
                    signOptions: {algorithm: 'RS256'}
                }
            },
        })
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        EnvService,
        JWTStrategy
    ]
})
export class AuthModule {}