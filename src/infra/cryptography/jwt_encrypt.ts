import { Encrypter } from "@/domain/fast_feet_main/application/cryptography/encrypt";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JWTEncrypter implements Encrypter {
    constructor(private jwt: JwtService) {}

    async encrypt(payload: Record<string, unknown>): Promise<string> {
        return this.jwt.signAsync(payload)
    }
}