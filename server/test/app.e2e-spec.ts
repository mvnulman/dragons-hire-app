import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';

// Requires a reachable PostgreSQL instance (DATABASE_URL) and migrated schema.
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) exposes API metadata', async () => {
    const response = await request(app.getHttpServer()).get('/').expect(200);
    expect(response.body).toMatchObject({ name: 'Dragons Hire API' });
  });

  it('/health (GET) reports database connectivity', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);
    expect(response.body).toMatchObject({ status: 'ok', database: 'up' });
  });

  afterAll(async () => {
    await app.close();
  });
});
