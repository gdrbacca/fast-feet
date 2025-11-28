import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: SendNotificationUseCase

describe('Create Notification Test', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'nova notificacao',
      content: 'conteudo da nova notificacao',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationRepository.items[0]).toEqual(
      result.value?.notification,
    )
  })
})
