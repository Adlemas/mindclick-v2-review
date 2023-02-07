import { Module } from '@nestjs/common';
import { CitySearchController } from './controller/city-search.controller';
import { CitySearchService } from './service/city-search.service';
import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from 'src/schemas/city.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: City.name,
        schema: CitySchema,
      },
    ]),
  ],
  controllers: [CitySearchController],
  providers: [CitySearchService],
})
export class CitySearchModule {}
