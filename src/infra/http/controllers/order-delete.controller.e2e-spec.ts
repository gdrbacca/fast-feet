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

describe('OrderDeleteController', () => {
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

  test('should delete an order', async () => {
        console.log('Teste e2e')
console.log(process.env.DATABASE_URL)
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
        userId: userCreated.id,
        recipientId: recipientCreated.id
    })

    const result = await request(app.getHttpServer())
      .delete(`/orders/${orderCreated.id.toString()}`)
      .set('authorization', `Bearer ${access_token}`)

      expect(result.statusCode).toBe(204)
     
      const newOrder = await prisma.order.findFirst({
        where: {
          id: orderCreated.id.toString(),
        }
      })

      expect(newOrder).toBeFalsy()
  });
});
