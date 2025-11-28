import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factory/user-factory"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { UserEditUseCase } from "./user-edit"

let inMemoryUserRepository: InMemoryUserRepository
let hasher: FakeHasher
let sut: UserEditUseCase
let userId: UniqueEntityID

describe('Change password of a user', () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUserRepository()
        hasher = new FakeHasher()
        sut = new UserEditUseCase(inMemoryUserRepository, hasher)

        inMemoryUserRepository.items.push(makeUser())
        userId = inMemoryUserRepository.items[0].id
    })

    it('should be able to register an user', async () => {
        const user = makeUser({
            name: 'user1',
            role: 'DELIVERYMAN',
            password: '123456-hashed'
        })
        
        inMemoryUserRepository.items.push(user)

        user.password = '654321'
        user.name = 'user12'

        const result = await sut.execute({
            id_sub: userId.toString(),
            id_user: user.id.toString(),
            user
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryUserRepository.items[1]).toEqual(
            expect.objectContaining({
                name: 'user12',
                password: '654321-hashed'
            }),
        )
    })

})