import { AppModule } from "@/infra/app.module";
import { BCryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from 'supertest'
import { MakeUser } from "test/factory/user-factory";

describe('Answer question (E2E)', () => {
  let app: INestApplication; 
  let prisma: PrismaService
  let jwt: JwtService
  let bcryptHasher: BCryptHasher
  let userFactory: MakeUser

  beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
          imports: [AppModule, DatabaseModule],
          providers: [BCryptHasher, MakeUser]
      })
      .compile();

      app = moduleRef.createNestApplication();
      prisma = moduleRef.get(PrismaService)
      jwt = moduleRef.get(JwtService)
      bcryptHasher = moduleRef.get(BCryptHasher)
      userFactory = moduleRef.get(MakeUser)

      await app.init();
  });

  test('should authenticate a user', async () => {
    const hashed_password = await bcryptHasher.generate('123456')
    const userCreated = await userFactory.create({
        name: 'Cleverson',
        cpf: '06665763943',
        password: hashed_password
    })

    const access_token = jwt.sign({ sub: userCreated.id.toString() })

    const result = await request(app.getHttpServer())
    .post('/session')
    .set('Authorization', `Bearer ${access_token}`)
    .send({
        cpf: '06665763943',
        password: '123456'
    })

    expect(result.body).toEqual(
        expect.objectContaining({
            access_token: expect.any(String)
        })
    )
  })

})