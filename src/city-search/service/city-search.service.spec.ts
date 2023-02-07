import { Test, TestingModule } from '@nestjs/testing';
import { CitySearchService } from './city-search.service';

describe('CitySearchService', () => {
  let service: CitySearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CitySearchService],
    }).compile();

    service = module.get<CitySearchService>(CitySearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
