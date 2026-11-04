import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { DragonDto, PaginatedDragonsDto } from './dto/dragon.dto.js';
import { QueryDragonsDto } from './dto/query-dragons.dto.js';
import { DragonsService } from './dragons.service.js';

@ApiTags('dragons')
@Controller('dragons')
@AllowAnonymous()
export class DragonsController {
  constructor(private readonly dragonsService: DragonsService) {}

  @Get()
  @ApiOperation({ summary: 'List the fleet with filters and pagination' })
  @ApiOkResponse({ type: PaginatedDragonsDto })
  findAll(@Query() query: QueryDragonsDto) {
    return this.dragonsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Dragon detail' })
  @ApiOkResponse({ type: DragonDto })
  findOne(@Param('id') id: string, @Query() query: QueryDragonsDto) {
    return this.dragonsService.findOne(id, query.locale ?? 'pt');
  }
}
