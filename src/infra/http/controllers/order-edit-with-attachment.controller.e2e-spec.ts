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
import { Attachment } from '@/domain/fast_feet_main/enterprise/entities/attachment';
import { OrderDeliveryman } from '@/domain/fast_feet_main/enterprise/entities/order-deliveryman';

describe('OrderEditWithAttachmentController', () => {
  let app: INestApplication;
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: MakeUser
  let recipientFactory: MakeRecipient
  let orderFactory: MakeOrder

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeUser, MakeRecipient, MakeOrder]
    })
    .compile();

    app = moduleRef.createNestApplication();
    
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(MakeUser)
    recipientFactory = moduleRef.get(MakeRecipient)
    orderFactory = moduleRef.get(MakeOrder)

    await app.init();
  });

  test('should edit an order', async () => {
    const userCreated = await userFactory.create({
      name: 'Cleverson',
      cpf: '06665763943',
    })

    const access_token = jwt.sign({ sub: userCreated.id.toString() })

    const recipientCreated = await recipientFactory.create({
        name: 'Clovis'
    })

    const orderCreated = await orderFactory.create({ 
        description: 'Order 1',
        status: "PENDING",
        userId: userCreated.id, 
        recipientId: recipientCreated.id
    })

    const attachment1 = Attachment.create({
        title: 'attachment 1',
        url: 'attachment1.com'
    })

    const attachment2 = Attachment.create({
        title: 'attachment 2',
        url: 'attachment2.com'
    })

    await prisma.attachment.createMany({
        data: [
            {
                id: attachment1.id.toString(), 
                title: attachment1.title,
                url: attachment1.url
            },
            {
                id: attachment2.id.toString(), 
                title: attachment2.title,
                url: attachment2.url
            },
        ]
    })

    await prisma.orderAndDeliveryUser.create({
        data: {
            orderId: orderCreated.id.toString(),
            userId: userCreated.id.toString()
        }
    })

    const result = await request(app.getHttpServer())
      .put(`/order/attachment/${orderCreated.id.toString()}`)
      .set('authorization', `Bearer ${access_token}`)
      .send({
        attachments: [attachment1.id.toString(), attachment2.id.toString()]
      })

    expect(result.statusCode).toBe(201)
    expect(result.body).toEqual(
        expect.objectContaining({
            description: 'Order 1',
            status: 'DELIVERED'
        }
    ))

    const attachment = await prisma.attachment.findMany({
        where: {
            id: {
                in: [attachment1.id.toString(), attachment2.id.toString()]
            }
        }
    })

    expect(attachment).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                title: 'attachment 1',
                orderId: orderCreated.id.toString(),
            }),
            expect.objectContaining({
                title: 'attachment 2',
                orderId: orderCreated.id.toString(),
            })
        ])
    )
  });
});
