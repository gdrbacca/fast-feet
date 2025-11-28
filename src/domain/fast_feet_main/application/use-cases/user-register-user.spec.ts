import { FakeHasher } from "test/cryptography/fake-hasher"
import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { RegisterUserUseCase } from "./user-register-user"
import { CreationNotAllowed } from "@/core/errors/creation-not-allowed"
import { makeUser } from "test/factory/user-factory"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let sut: RegisterUserUseCase
let userId: UniqueEntityID

describe('Register user test', () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUserRepository()
        fakeHasher = new FakeHasher()
        sut = new RegisterUserUseCase(inMemoryUserRepository, fakeHasher)

        inMemoryUserRepository.items.push(makeUser())
        userId = inMemoryUserRepository.items[0].id
    })

    it('should be able to register an user', async () => {
        const result = await sut.execute({
            id_sub: userId.toString(),
            name: 'Jonas',
            cpf: '06665763943',
            password: '123456',
            roleToRegister: 'DELIVERYMAN'
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            user: inMemoryUserRepository.items[1]
        })
    })

    it('should not be able to register an user with same cpf', async () => {
        await sut.execute({
            id_sub: userId.toString(),
            name: 'Clovis',
            cpf: '06665763943',
            password: '123456',
            roleToRegister: 'DELIVERYMAN'
        })

        const result = await sut.execute({
            id_sub: userId.toString(),
            name: 'Jonas',
            cpf: '06665763943',
            password: '123456',
            roleToRegister: 'DELIVERYMAN'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(CreationNotAllowed)
    })

    it('should hash student password upon registration', async () => {
        const result = await sut.execute({
            id_sub: userId.toString(),
            name: 'John',
            cpf: '06665763943',
            password: '123456',
            roleToRegister: 'DELIVERYMAN'
        })

        const password_hash = await fakeHasher.generate('123456')

        expect(result.isRight()).toBe(true)
        expect(inMemoryUserRepository.items[1].password).toEqual(password_hash)
    })
})