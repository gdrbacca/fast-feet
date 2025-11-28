import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository"
import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factory/user-factory"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { makeRecipient } from "test/factory/recipient-factory"
import { RecipientDeleteUseCase } from "./recipient-delete"

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: RecipientDeleteUseCase
let userAdminId: UniqueEntityID
let recipientID: UniqueEntityID
let recipientID2: UniqueEntityID

describe('Recipient Delete test', () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUserRepository()
        inMemoryRecipientRepository = new InMemoryRecipientRepository()

        sut = new RecipientDeleteUseCase(inMemoryUserRepository, inMemoryRecipientRepository)

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

        const recipient2 = makeRecipient({
            name: 'Josley',
            address: 'Rua Henrique Quinto',
            number: '1234'
        })
        inMemoryRecipientRepository.items.push(recipient2)
        recipientID2 = recipient2.id
    })

    it('should be able to delete a recipient', async () => {
        const result = await sut.execute({
            id_sub: userAdminId.toString(),
            id_recipient: recipientID.toString()
        })

        expect(result.isRight()).toBe(true)

        const recipients = await inMemoryRecipientRepository.findMany()

        expect(inMemoryRecipientRepository.items.length).toEqual(1)
        expect(recipients).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'Josley'
                }),
            ])
        )
    })

})