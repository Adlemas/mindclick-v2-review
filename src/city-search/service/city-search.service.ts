import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { City } from 'src/schemas/city.schema';
import { Model } from 'mongoose';
import { SearchCitiesDto } from 'src/city-search/dto/search-cities.dto';
import { from, Observable } from 'rxjs';

@Injectable()
export class CitySearchService {
  @InjectModel(City.name)
  private readonly cityModel: Model<City>;

  findCities(dto: SearchCitiesDto): Observable<Array<City>> {
    return from(
      this.cityModel
        .find({
          city: {
            $regex: dto.query,
            $options: 'gi',
          },
        })
        .limit(dto.limit ?? 20)
        .sort({
          city: 1,
        })
        .exec(),
    );
  }
}
