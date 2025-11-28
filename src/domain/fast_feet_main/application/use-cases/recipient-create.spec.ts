import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository"
import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { RecipientCreateUseCase } from "./recipient-create"
import { makeUser } from "test/factory/user-factory"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: RecipientCreateUseCase
let userAdminId: UniqueEntityID

describe('Recipient Create test', () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUserRepository()
        inMemoryRecipientRepository = new InMemoryRecipientRepository()

        sut = new RecipientCreateUseCase(inMemoryUserRepository, inMemoryRecipientRepository)

        const userAdmin = makeUser({
            name: 'Procópio',
            role: 'ADMIN'
        })
        inMemoryUserRepository.items.push(userAdmin)
        userAdminId = userAdmin.id
    })

    it('should be able to create a recipient', async () => {
        const result = await sut.execute({
            id_sub: userAdminId.toString(),
            name: 'Vladison',
            address: 'Rua Pelotudo',
            number: '333'
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryRecipientRepository.items.length).toEqual(1)
    })

})