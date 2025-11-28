import { Module } from "@nestjs/common";
import { BCryptHasher } from "./bcrypt-hasher";
import { HashCompare, HashGenerator } from "@/domain/fast_feet_main/application/cryptography/hash-generator-and-compare";
import { Encrypter } from "@/domain/fast_feet_main/application/cryptography/encrypt";
import { JWTEncrypter } from "./jwt_encrypt";

@Module({
    providers: [
        {
            provide: HashCompare,
            useClass: BCryptHasher
        },
        {
            provide: HashGenerator,
            useClass: BCryptHasher
        },
        {
            provide: Encrypter,
            useClass: JWTEncrypter
        }
    ],
    exports: [HashCompare, HashGenerator, Encrypter]
})
export class CryptModule {}