import { FakeHasher } from "test/cryptography/fake-hasher"
import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { AuthenticateUseCase } from "./user-authenticate"
import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factory/user-factory"
import { WrongCredentialsError } from "@/core/errors/wrong-credentials"

let inMemoryUserRepository: InMemoryUserRepository
let hashCompare: FakeHasher
let encrypter: FakeEncrypter
let sut: AuthenticateUseCase

describe('authenticate user test', () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUserRepository()
        hashCompare = new FakeHasher()
        encrypter = new FakeEncrypter()
        sut = new AuthenticateUseCase(inMemoryUserRepository, hashCompare, encrypter)
    })

    it('should authenticate user', async () => {
        await inMemoryUserRepository.create(makeUser())

        const result = await sut.execute({
            cpf: '12365498743',
            password: '123456'
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual(expect.objectContaining({
            access_token: expect.any(String)
        }))
    })

    it('should not authenticate user with wrong password', async () => {
        await inMemoryUserRepository.create(makeUser())

        const result = await sut.execute({
            cpf: '12365498743',
            password: '123556'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(WrongCredentialsError)
    })


})