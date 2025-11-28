import { HashCompare, HashGenerator } from "@/domain/fast_feet_main/application/cryptography/hash-generator-and-compare";
import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";

@Injectable()
export class BCryptHasher implements HashGenerator, HashCompare {
    async compare(textToCompare: string, hash: string): Promise<boolean> {
        return compare(textToCompare, hash)
    }

    async generate(text: string): Promise<string> {
        const hashed_text = await hash(text, 6)

        return hashed_text
    }
}