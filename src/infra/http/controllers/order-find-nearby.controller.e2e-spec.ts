import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest'
import { MakeUser } from 'test/factory/user-factory';
import { DatabaseModule } from '@/infra/database/prisma/database.module';
import { MakeRecipient } from 'test/factory/recipient-factory';
import { MakeOrder } from 'test/factory/order-factory';

describe('OrderListController', () => {
  let app: INestApplication;
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
    
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(MakeUser)
    recipientFactory = moduleRef.get(MakeRecipient)
    orderFactory = moduleRef.get(MakeOrder)

    await app.init();
  });

  test('should get all nearby orders', async () => {
    const userCreated = await userFactory.create({
      name: 'Cleverson',
      cpf: '06665763943',
    })

    const access_token = jwt.sign({ sub: userCreated.id.toString() })

    const recipientCreated = await recipientFactory.create({
        name: 'Clovis'
    })

    await orderFactory.create({ 
        description: 'Order 1',
        status: "PENDING",
        userId: userCreated.id, 
        recipientId: recipientCreated.id,
        latitude: -26.8465867,
        longitude: -49.1203584
    })

    await orderFactory.create({ 
        description: 'Order 2',
        status: "PENDING",
        userId: userCreated.id, 
        recipientId: recipientCreated.id,
        latitude: -26.8705354,
        longitude: -49.1138514
    })

    await orderFactory.create({ 
        description: 'Order 3',
        status: "PENDING",
        userId: userCreated.id, 
        recipientId: recipientCreated.id,
        latitude: -26.9775865,
        longitude: -49.0063074
    })

    const result = await request(app.getHttpServer())
      .get(`/order/nearby`)
      .set('authorization', `Bearer ${access_token}`)
      .send({
        latitude: -26.8813532,
        longitude: -49.1112895
      })

      expect(result.statusCode).toBe(201)
      expect(result.body).toEqual(expect.objectContaining({
            orders: expect.objectContaining([
                expect.objectContaining({
                    description: 'Order 1'
                }),
                expect.objectContaining({
                    description: 'Order 2'
                })
            ])
        }
      ))
  });
});
