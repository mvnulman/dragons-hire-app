import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInfo() {
    return {
      name: 'Dragons Hire API',
      tagline: 'Rent the right dragon for the right mission.',
      version: '0.1.0',
      docs: '/docs',
      health: '/health',
    };
  }
}
