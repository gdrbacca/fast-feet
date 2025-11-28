import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest'
import { MakeUser } from 'test/factory/user-factory';
import { DatabaseModule } from '@/infra/database/prisma/database.module';
import { MakeRecipient } from 'test/factory/recipient-factory';
import { MakeOrder } from 'test/factory/order-factory';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaOrderMapper } from '@/infra/database/prisma/repositories/mapppers/order-mapper';

describe('OrderListController', () => {
  let app: INestApplication;
  let jwt: JwtService
  let userFactory: MakeUser
  let recipientFactory: MakeRecipient
  let orderFactory: MakeOrder
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeUser, MakeRecipient, MakeOrder, PrismaService]
    })
    .compile();

    app = moduleRef.createNestApplication();
    
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(MakeUser)
    recipientFactory = moduleRef.get(MakeRecipient)
    orderFactory = moduleRef.get(MakeOrder)
    prisma = moduleRef.get(PrismaService)

    await app.init();
  });

  test('should get all orders of a user', async () => {
    const userCreated = await userFactory.create({
      name: 'Cleverson',
      cpf: '06665763943',
    })

    const userCreated2 = await userFactory.create({
      name: 'Roberson',
      cpf: '06665763945',
      role: "ADMIN"
    })


    //const users = await prisma.user.findMany()
    //console.log(users)

    const access_token = jwt.sign({ sub: userCreated2.id.toString() })

    const recipientCreated = await recipientFactory.create({
        name: 'Clovis'
    })

    const order = await orderFactory.create({
        description: 'Order 1',
        status: "PENDING",
        userId: userCreated.id, 
        recipientId: recipientCreated.id,
        latitude: -26.8465867,
        longitude: -49.1203581
    })

    const order2 = await orderFactory.create({
        description: 'Order 2',
        status: "PENDING",
        userId: userCreated.id, 
        recipientId: recipientCreated.id,
        latitude: -26.8465867,
        longitude: -49.1203584
    })


    order.status = "PICKED_UP"
    order2.status = "PICKED_UP"

    await prisma.order.update({
        where: {
            id: order.id.toString(),
        },
        data: PrismaOrderMapper.toPrisma(order)
    })

    await prisma.orderAndDeliveryUser.create({
        data: {
            userId: userCreated2.id.toString(),
            orderId: order.id.toString(),
        }
    })

    await prisma.order.update({
        where: {
            id: order2.id.toString(),
        },
        data: PrismaOrderMapper.toPrisma(order2)
    })

    await prisma.orderAndDeliveryUser.create({
        data: {
            userId: userCreated2.id.toString(),
            orderId: order2.id.toString(),
        }
    })

    const order_after = await prisma.order.findMany()
    console.log(order_after)

    const result = await request(app.getHttpServer())
      .get(`/order/deliveryman`)
      .set('authorization', `Bearer ${access_token}`)

      expect(result.statusCode).toBe(201)
      expect(result.body).toEqual(expect.objectContaining({
            orders: expect.objectContaining([
                expect.objectContaining({
                    description: 'Order 1'
                }),
                expect.objectContaining({
                    description: 'Order 2'
                }),
            ])
        }
      ))
  });
});
