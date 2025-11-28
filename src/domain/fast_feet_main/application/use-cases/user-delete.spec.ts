import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factory/user-factory"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { UserDeleteUseCase } from "./user-delete"

let inMemoryUserRepository: InMemoryUserRepository
let sut: UserDeleteUseCase
let userId: UniqueEntityID

describe('Delete user', () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUserRepository()
        sut = new UserDeleteUseCase(inMemoryUserRepository)

        inMemoryUserRepository.items.push(makeUser())
        userId = inMemoryUserRepository.items[0].id
    })

    it('should be able to delete an user', async () => {
        const user = makeUser({
            name: 'user1',
            role: 'DELIVERYMAN',
        })
        
        inMemoryUserRepository.items.push(user)

        const result = await sut.execute({
            id_sub: userId.toString(),
            id_user: user.id.toString(),
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryUserRepository.items).toHaveLength(1)
    })

})