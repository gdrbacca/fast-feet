import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest'
import { MakeUser } from 'test/factory/user-factory';
import { DatabaseModule } from '@/infra/database/prisma/database.module';
import { MakeRecipient } from 'test/factory/recipient-factory';

describe('RecipientEditController', () => {
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

  test('should edit a recipient', async () => {
    const userCreated = await userFactory.create({
      name: 'Cleverson',
      cpf: '06665763943',
    })

    const access_token = jwt.sign({ sub: userCreated.id.toString() })

    const recipient = await recipientFactory.create({
        name: 'Asdrubal',
        address: 'Rua Yenseio',
        number: '3131'
    })

    const result = await request(app.getHttpServer())
      .post(`/recipient/${recipient.id.toString()}`)
      .set('authorization', `Bearer ${access_token}`)
      .send({
        name: 'Asdrubal Silva',
        address: 'Rua Yenseio',
        number: '3132'
      })

      expect(result.statusCode).toBe(201)
     
      const newRecipient = await prisma.recipient.findFirst({
        where: {
          id: recipient.id.toString(),
        }
      })

      expect(newRecipient?.name).toEqual('Asdrubal Silva')
  });
});
