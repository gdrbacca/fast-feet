import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest'
import { MakeUser } from 'test/factory/user-factory';
import { DatabaseModule } from '@/infra/database/prisma/database.module';

describe('GetUserController', () => {
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

  test('should get all users', async () => {
    const userCreated = await userFactory.create({
      name: 'Cleverson',
      cpf: '06665763943',
    })

    const access_token = jwt.sign({ sub: userCreated.id.toString() })

    await userFactory.create({
      name: 'Mirosberto',
      cpf: '06665748777',
      role: 'DELIVERYMAN'
    })
    await userFactory.create({
      name: 'Claudiosmar',
      cpf: '06665748888',
      role: 'DELIVERYMAN'
    })
    await userFactory.create({
      name: 'Marcionei',
      cpf: '06665748999',
      role: 'DELIVERYMAN'
    })

    const result = await request(app.getHttpServer())
      .get('/user')
      .set('authorization', `Bearer ${access_token}`)
      .send()

      expect(result.statusCode).toBe(200)
    
      expect(result.body.length).toBe(3)
  });
});
