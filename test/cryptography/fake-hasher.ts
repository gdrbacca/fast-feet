import { HashCompare, HashGenerator } from "@/domain/fast_feet_main/application/cryptography/hash-generator-and-compare";

export class FakeHasher implements HashGenerator, HashCompare {
    async compare(textToCompare: string, hash: string): Promise<boolean> {
        return textToCompare.concat('-hashed') === hash
    }

    async generate(text: string): Promise<string> {
        return text.concat('-hashed')
    }

}