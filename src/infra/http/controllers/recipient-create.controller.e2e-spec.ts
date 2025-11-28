import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest'
import { MakeUser } from 'test/factory/user-factory';
import { DatabaseModule } from '@/infra/database/prisma/database.module';

describe('RecipientCreateController', () => {
  let app: INestApplication;
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: MakeUser

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeUser]
    })
    .compile();

    app = moduleRef.createNestApplication();
    
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(MakeUser)

    await app.init();
  });

  test('should create a recipient', async () => {
    const userCreated = await userFactory.create({
      name: 'Cleverson',
      cpf: '06665763943',
    })

    const access_token = jwt.sign({ sub: userCreated.id.toString() })

    const result = await request(app.getHttpServer())
      .post(`/recipient`)
      .set('authorization', `Bearer ${access_token}`)
      .send({
        name: 'Cleidson',
        address: 'Rua Girosberto Terceiro',
        number: '2230'
      })

      expect(result.statusCode).toBe(201)
     
      const newRecipient = await prisma.recipient.findFirst({
        where: {
          name: 'Cleidson',
        }
      })

      expect(newRecipient?.name).toEqual('Cleidson')
  });
});
