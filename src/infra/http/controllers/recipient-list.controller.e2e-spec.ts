import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest'
import { MakeUser } from 'test/factory/user-factory';
import { DatabaseModule } from '@/infra/database/prisma/database.module';
import { MakeRecipient } from 'test/factory/recipient-factory';

describe('RecipientListController', () => {
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

    await recipientFactory.create({
        name: 'Asdrubal',
        address: 'Rua Yenseio',
        number: '3131'
    })
    await recipientFactory.create({
        name: 'Adroaldo',
        address: 'Rua Bloom Strair',
        number: '3132'
    })
    await recipientFactory.create({
        name: 'Astronis',
        address: 'Rua Esterco Virgem',
        number: '3133'
    })

    const result = await request(app.getHttpServer())
      .get(`/recipient`)
      .set('authorization', `Bearer ${access_token}`)

      expect(result.statusCode).toBe(201)
    console.log(result.body)
      expect(result.body).toEqual({
        recipients: expect.arrayContaining([
            expect.objectContaining({
                name: 'Asdrubal',
            }),
            expect.objectContaining({
                name: 'Adroaldo',
            }),
            expect.objectContaining({
                name: 'Astronis',
            }),
        ])
      })
  });
});
