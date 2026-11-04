import { Module } from '@nestjs/common';
import { DragonsController } from './dragons.controller.js';
import { DragonsService } from './dragons.service.js';

@Module({
  controllers: [DragonsController],
  providers: [DragonsService],
  exports: [DragonsService],
})
export class DragonsModule {}
