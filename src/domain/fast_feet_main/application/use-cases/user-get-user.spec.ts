import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factory/user-factory"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { GetUserUseCase } from "./user-get-user"

let inMemoryUserRepository: InMemoryUserRepository
let sut: GetUserUseCase
let userId: UniqueEntityID

describe('Register user test', () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUserRepository()
        sut = new GetUserUseCase(inMemoryUserRepository)

        inMemoryUserRepository.items.push(makeUser())
        userId = inMemoryUserRepository.items[0].id
    })

    it('should be able to register an user', async () => {
        inMemoryUserRepository.items.push(makeUser({
            name: 'user1',
            role: 'DELIVERYMAN'
        }))
        inMemoryUserRepository.items.push(makeUser({
            name: 'user2',
            role: 'DELIVERYMAN'
        }))
        inMemoryUserRepository.items.push(makeUser({
            name: 'user3',
            role: 'DELIVERYMAN'
        }))

        const result = await sut.execute({
            id_sub: userId.toString(),
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            users: expect.objectContaining([
                expect.objectContaining({name: 'user1'}),
                expect.objectContaining({name: 'user2'}),
                expect.objectContaining({name: 'user3'}),
            ])
        })
    })

})