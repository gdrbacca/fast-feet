import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { vi } from 'vitest'
import { DomainEvents } from './domain-events'
import { AggregateRoot } from '../entities/aggregate-root'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  // eslint-disable-next-line no-use-before-define
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // subscriber cadastrado (ouvindo o evento de "resposta criada")
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // criando uma resposta porem sem salvar no banco
    const aggregate = CustomAggregate.create()

    // assegurando que o evento foi criado porém nao foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // salvando a resposta no banco e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // o subscriber ouve o evento e faz oque precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled()

    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
