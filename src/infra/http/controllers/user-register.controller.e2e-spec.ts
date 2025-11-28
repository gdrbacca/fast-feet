import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest'
import { MakeUser } from 'test/factory/user-factory';
import { DatabaseModule } from '@/infra/database/prisma/database.module';

describe('RegisterUserController', () => {
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

  test('should register an user', async () => {
    const userCreated = await userFactory.create({
      name: 'Cleverson',
      cpf: '06665763943',
    })

    const access_token = jwt.sign({ sub: userCreated.id.toString() })

    const result = await request(app.getHttpServer())
      .post('/user')
      .set('authorization', `Bearer ${access_token}`)
      .send({
        name: 'Clovis',
        cpf: '06654678912',
        password: '123456',
        roleToRegister: 'DELIVERYMAN'
      })

      expect(result.statusCode).toBe(201)

      const newUser = await prisma.user.findFirst({
        where: {
          cpf: '06654678912',
        }
      })

      expect(newUser).toBeTruthy()

      const users = await prisma.user.findMany()

      expect(users.length).toBe(2)
  });
});
