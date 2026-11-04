import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';

// Requires a reachable PostgreSQL instance (DATABASE_URL) and migrated schema.
describe('Better Auth (e2e)', () => {
  let app: INestApplication;
  const email = `keeper-${Date.now()}@dragons.hire`;
  const password = 'lorem-ipsum-dolor-1337';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('signs up a new client', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/sign-up/email')
      .send({ email, password, name: 'Test Keeper' })
      .expect(200);

    expect(response.body.user).toMatchObject({ email, role: 'CLIENT' });
  });

  it('rejects a wrong password', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/sign-in/email')
      .send({ email, password: 'wrong-password' })
      .expect(401);
  });

  it('signs in with valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/sign-in/email')
      .send({ email, password })
      .expect(200);

    expect(response.body.user).toMatchObject({ email });
  });

  afterAll(async () => {
    await app.close();
  });
});
