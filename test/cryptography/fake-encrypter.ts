import { Encrypter } from "@/domain/fast_feet_main/application/cryptography/encrypt";

export class FakeEncrypter implements Encrypter {
    
    async encrypt(payload: Record<string, unknown>): Promise<string> {
        return JSON.stringify(payload)
    }

}