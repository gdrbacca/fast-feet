export abstract class HashGenerator {
    abstract generate(text: string): Promise<string>
}

export abstract class HashCompare {
    abstract compare(textToCompare: string, hash: string): Promise<boolean>
}