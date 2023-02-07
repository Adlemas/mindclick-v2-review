import { Module } from '@nestjs/common';
import { CitySearchController } from './controller/city-search.controller';
import { CitySearchService } from './service/city-search.service';

@Module({
  controllers: [CitySearchController],
  providers: [CitySearchService],
})
export class CitySearchModule {}
