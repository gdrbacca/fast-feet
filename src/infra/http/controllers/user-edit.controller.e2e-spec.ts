import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest'
import { MakeUser } from 'test/factory/user-factory';
import { DatabaseModule } from '@/infra/database/prisma/database.module';
import { BCryptHasher } from '@/infra/cryptography/bcrypt-hasher';

describe('ChangePasswordController', () => {
  let app: INestApplication;
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: MakeUser
  let hasher: BCryptHasher

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MakeUser, BCryptHasher]
    })
    .compile();

    app = moduleRef.createNestApplication();
    
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(MakeUser)
    hasher = moduleRef.get(BCryptHasher)

    await app.init();
  });

  test('should change the password of a user', async () => {
    const userCreated = await userFactory.create({
      name: 'Cleverson',
      cpf: '06665763943'
    })

    const access_token = jwt.sign({ sub: userCreated.id.toString() })

    const password_hashed = await hasher.generate('123456')

    const user = await userFactory.create({
      name: 'Mirosberto',
      cpf: '06665748777',
      password: password_hashed,
      role: 'DELIVERYMAN'
    })

    user.name = 'Mirosberto Silva'
    user.password = await hasher.generate('654321')


    const result = await request(app.getHttpServer())
      .patch('/user')
      .set('authorization', `Bearer ${access_token}`)
      .send(
        user.user_short
      )

      expect(result.statusCode).toBe(201)
    
      const user_changed = await prisma.user.findUnique({
        where: {
            id: user.id.toString()
        }
      })

      expect(user_changed?.password).not.toBe(password_hashed)
  });
});
