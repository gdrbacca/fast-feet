import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository"
import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factory/user-factory"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { makeRecipient } from "test/factory/recipient-factory"
import { RecipientListUseCase } from "./recipient-list"

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: RecipientListUseCase
let userAdminId: UniqueEntityID
let recipientID: UniqueEntityID
let recipientID2: UniqueEntityID
let recipientID3: UniqueEntityID

describe('Recipient List test', () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUserRepository()
        inMemoryRecipientRepository = new InMemoryRecipientRepository()

        sut = new RecipientListUseCase(inMemoryUserRepository, inMemoryRecipientRepository)

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

        const recipient3 = makeRecipient({
            name: 'Josna',
            address: 'Rua Clobisleidson',
            number: '1235'
        })
        inMemoryRecipientRepository.items.push(recipient3)
        recipientID3 = recipient3.id
    })

    it('should be able to edit a recipient', async () => {
        const result = await sut.execute({
            id_sub: userAdminId.toString(),
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            recipients: expect.arrayContaining([
                expect.objectContaining({
                    name: 'Jobson'
                }),
                expect.objectContaining({
                    name: 'Josley'
                }),
                expect.objectContaining({
                    name: 'Josna'
                }),
            ])
        })
    })

})