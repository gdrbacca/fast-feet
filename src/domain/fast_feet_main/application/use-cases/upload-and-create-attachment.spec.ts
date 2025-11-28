import { InMemoryAttachmentRepository } from "test/repositories/in-memory-attachment-repository"
import { FakeUploader } from "test/storage/fake-uploader"
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment"
import { InMemoryUserRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factory/user-factory"

let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let inMemoryUserRepository: InMemoryUserRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('authenticate user test', () => {
    beforeEach(() => {
        inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
        inMemoryUserRepository = new InMemoryUserRepository()
        fakeUploader = new FakeUploader()
        sut = new UploadAndCreateAttachmentUseCase(
            inMemoryAttachmentRepository, 
            inMemoryUserRepository,
            fakeUploader
        )
    })

    it('should upload and create attachment', async () => {
        const user = await makeUser()
        inMemoryUserRepository.items.push(user)

        const result = await sut.execute({
            id_sub: user.id.toString(),
            fileName: 'claudio.png',
            fileType: 'image/png',
            body: Buffer.from('')
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual(expect.objectContaining({
            attachment: expect.objectContaining({
                title: 'claudio.png',
                url: expect.any(String)
            })
        }))
    })
})