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

describe('OrderChangeStatusController', () => {
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
      role: 'ADMIN'
    })

    const userDeliverymanCreated = await userFactory.create({
      name: 'Roberson',
      cpf: '06665763945',
      role: 'DELIVERYMAN'
    })

    const access_token = jwt.sign({ sub: userDeliverymanCreated.id.toString() })

    const recipientCreated = await recipientFactory.create({
        name: 'Clovis'
    })

    const orderCreated = await orderFactory.create({ 
        description: 'Order 1',
        status: "PENDING",
        userId: userCreated.id, 
        recipientId: recipientCreated.id,
    })


    const result = await request(app.getHttpServer())
      .put(`/order/status/${orderCreated.id.toString()}`)
      .set('authorization', `Bearer ${access_token}`)
      .send({
        status: 'PICKED_UP',
      })

      expect(result.statusCode).toBe(201)
      expect(result.body).toEqual(expect.objectContaining({
          status: 'PICKED_UP'
        }
      ))
  });
});
