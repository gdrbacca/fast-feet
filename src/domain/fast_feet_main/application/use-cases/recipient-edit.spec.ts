import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository"
import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factory/user-factory"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { makeRecipient } from "test/factory/recipient-factory"
import { RecipientEditUseCase } from "./recipient-edit"

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: RecipientEditUseCase
let userAdminId: UniqueEntityID
let recipientID: UniqueEntityID

describe('Recipient Edit test', () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUserRepository()
        inMemoryRecipientRepository = new InMemoryRecipientRepository()

        sut = new RecipientEditUseCase(inMemoryUserRepository, inMemoryRecipientRepository)

        const userAdmin = makeUser({
            name: 'Procópio',
            role: 'ADMIN'
        })
        inMemoryUserRepository.items.push(userAdmin)
        userAdminId = userAdmin.id

        const recipient = makeRecipient({
            name: 'Jobson',
            address: 'Rua Martendal',
            number: '1233'
        })
        inMemoryRecipientRepository.items.push(recipient)
        recipientID = recipient.id
    })

    it('should be able to edit a recipient', async () => {
        const result = await sut.execute({
            id_sub: userAdminId.toString(),
            id_recipient: recipientID.toString(),
            name: 'Jobson',
            address: 'Rua Pelotudo',
            number: '1233'
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryRecipientRepository.items[0]).toEqual(
            expect.objectContaining({
                name: 'Jobson',
                address: 'Rua Pelotudo',
                number: '1233'
            })
        )
    })

})