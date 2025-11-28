import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from 'supertest'
import { MakeUser } from "test/factory/user-factory";

describe('Upload and create attachment (E2E)', () => {
  let app: INestApplication; 
  let jwt: JwtService
  let userFactory: MakeUser

  beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
          imports: [AppModule, DatabaseModule],
          providers: [MakeUser]
      })
      .compile();

      app = moduleRef.createNestApplication();
      jwt = moduleRef.get(JwtService)
      userFactory = moduleRef.get(MakeUser)

      await app.init();
  });

  test('should upload and create an attachment', async () => {
    const userCreated = await userFactory.create({
        name: 'Cleverson',
    })

    const access_token = jwt.sign({ sub: userCreated.id.toString() })


    const result = await request(app.getHttpServer())
        .post('/attachment')
        .set('Authorization', `Bearer ${access_token}`)
        .attach('file', './test/e2e/sample-upload.jpg')

    expect(result.body).toEqual(
        expect.objectContaining({
            attachmentId: expect.any(String)
        })
    ) 
  })

})