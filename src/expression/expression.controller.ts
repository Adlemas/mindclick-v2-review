import { Body, Controller, Get, Inject } from '@nestjs/common';
import { ExpressionService } from 'src/expression/expression.service';
import { MentalPayloadDto } from 'src/expression/dto/mental-payload.dto';

@Controller('expression')
export class ExpressionController {
  @Inject(ExpressionService)
  private readonly expressionService: ExpressionService;

  @Get('mental')
  mental(@Body() dto: MentalPayloadDto) {
    return this.expressionService.mental(dto);
  }
}
