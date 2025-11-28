import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest'
import { MakeUser } from 'test/factory/user-factory';
import { DatabaseModule } from '@/infra/database/prisma/database.module';
import { MakeRecipient } from 'test/factory/recipient-factory';

describe('OrderCreateController', () => {
  let app: INestApplication;
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: MakeUser
  let recipientFactory: MakeRecipient

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeUser, MakeRecipient]
    })
    .compile();

    app = moduleRef.createNestApplication();
    
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(MakeUser)
    recipientFactory = moduleRef.get(MakeRecipient)

    await app.init();
  });

  test('should create an order', async () => {
    const userCreated = await userFactory.create({
      name: 'Cleverson',
      cpf: '06665763943',
    })

    const access_token = jwt.sign({ sub: userCreated.id.toString() })

    const recipientCreated = await recipientFactory.create({
        name: 'Clovis'
    })

    const result = await request(app.getHttpServer())
      .post('/order')
      .set('authorization', `Bearer ${access_token}`)
      .send({
        description: 'Encomenda do barulho',
        recipientId: recipientCreated.id.toString(),
        status: 'PENDING',
        latitude: -26.8921359,
        longitude: -49.005693
      })

      expect(result.statusCode).toBe(201)
      const { orderId } = result

      const newOrder = await prisma.order.findFirst({
        where: {
          id: orderId,
        }
      })

      expect(newOrder).toBeTruthy()

      const orders = await prisma.order.findMany()

      expect(orders.length).toBe(1)
  });
});
