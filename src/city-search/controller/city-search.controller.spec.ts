import { Test, TestingModule } from '@nestjs/testing';
import { CitySearchController } from './city-search.controller';

describe('CitySearchController', () => {
  let controller: CitySearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitySearchController],
    }).compile();

    controller = module.get<CitySearchController>(CitySearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
