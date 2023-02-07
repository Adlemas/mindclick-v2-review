import { Controller, Get, Inject, Query } from '@nestjs/common';
import { CitySearchService } from 'src/city-search/service/city-search.service';
import { SearchCitiesDto } from 'src/city-search/dto/search-cities.dto';

@Controller('city-search')
export class CitySearchController {
  @Inject(CitySearchService)
  private readonly citySearchService: CitySearchService;

  @Get()
  getCities(@Query() searchDto: SearchCitiesDto) {
    return this.citySearchService.findCities({
      limit: searchDto.limit,
      query: searchDto.query,
    });
  }
}
