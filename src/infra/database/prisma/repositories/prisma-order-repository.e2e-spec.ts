import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest'
import { MakeUser } from 'test/factory/user-factory';
import { DatabaseModule } from '@/infra/database/prisma/database.module';
import { MakeRecipient } from 'test/factory/recipient-factory';
import { MakeOrder } from 'test/factory/order-factory';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { OrderRepository } from '@/domain/fast_feet_main/application/repository/order-repository';
import { CacheModule } from '@/infra/cache/cache.module';
import { cached } from 'zod/v4/core/util.cjs';
import { AttachmentRepository } from '@/domain/fast_feet_main/application/repository/attachment-repository';
import { OrderAttachmentRepository } from '@/domain/fast_feet_main/application/repository/order-attachment-repository';
import { Attachment } from '@/domain/fast_feet_main/enterprise/entities/attachment';
import { OrderAttachment } from '@/domain/fast_feet_main/enterprise/entities/order-attachment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { OrderAttachmentList } from '@/domain/fast_feet_main/enterprise/entities/attachment-list';

describe('OrderListController', () => {
  let app: INestApplication;
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: MakeUser
  let recipientFactory: MakeRecipient
  let orderFactory: MakeOrder
  let cacheRepository: CacheRepository
  let orderRepository: OrderRepository
  let attachmentRepository: AttachmentRepository
  let orderAttachmentRepository: OrderAttachmentRepository

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [MakeUser, MakeRecipient, MakeOrder]
    })
    .compile();

    app = moduleRef.createNestApplication();
    
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(MakeUser)
    recipientFactory = moduleRef.get(MakeRecipient)
    orderFactory = moduleRef.get(MakeOrder)
    cacheRepository = moduleRef.get(CacheRepository)
    orderRepository = moduleRef.get(OrderRepository)
    attachmentRepository = moduleRef.get(AttachmentRepository)
    orderAttachmentRepository = moduleRef.get(OrderAttachmentRepository)

    await app.init();
  });

  test('should get order by id', async () => {
    const userCreated = await userFactory.create({
      name: 'Cleverson',
      cpf: '06665763943',
    })


    const recipientCreated = await recipientFactory.create({
        name: 'Clovis'
    })

    const orderCreated = await orderFactory.create({ 
        description: 'Order 1',
        status: "PENDING",
        userId: userCreated.id, 
        recipientId: recipientCreated.id
    })

    const order = await orderRepository.findById(orderCreated.id.toString())

    const cached = await cacheRepository.get(`order:${order?.id.toString()}`)

    if (!cached) {
        throw new Error()
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: order?.id.toString()
      })
    )
  });

  test('should delete cache when edit order', async () => {
    const userCreated = await userFactory.create({
      name: 'Cleverson',
      cpf: '06665763944',
    })


    const recipientCreated = await recipientFactory.create({
        name: 'Clovis'
    })

    const orderCreated = await orderFactory.create({ 
        description: 'Order 1',
        status: "PENDING",
        userId: userCreated.id, 
        recipientId: recipientCreated.id
    })

    const order = await orderRepository.findById(orderCreated.id.toString())
    if (!order) {
        throw new Error()
    }

    const cached = await cacheRepository.get(`order:${orderCreated.id.toString()}`)

    if (!cached) {
        throw new Error()
    }

    expect(cached).not.toBeNull()

    const attachment = Attachment.create({
        title: 'arquivoGrande',
        url: 'arquivoGrande123456.jpg'
    })
    await attachmentRepository.create(attachment)

    const attachmentsList = Array.from([attachment.id.toString()])

    const orderAttachmentList = attachmentsList.map(item => {
        return OrderAttachment.create({
            orderId: order?.id,
            attachmentId: new UniqueEntityID(item)
        })
    })

    order.description = 'Nova description'
    order.attachments = new OrderAttachmentList(orderAttachmentList)

    await orderRepository.edit(order.id.toString(), order)

    const cachedAfterEdit = await cacheRepository.get(`order:${order.id.toString()}`)

    expect(cachedAfterEdit).toBeFalsy()

  })
});
