import { Body, Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ExpressionService } from 'src/expression/expression.service';
import { MentalPayloadDto } from 'src/expression/dto/mental-payload.dto';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { MultiplyPayloadDto } from 'src/expression/dto/mutliply-payload.dto';

@Controller('expression')
export class ExpressionController {
  @Inject(ExpressionService)
  private readonly expressionService: ExpressionService;

  @UseGuards(AccessTokenGuard)
  @Get('mental')
  mental(@Body() dto: MentalPayloadDto) {
    return this.expressionService.mental({
      ...dto,
      isBiggerMax: dto.isBiggerMax ?? false,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get('multiply')
  multiply(@Body() dto: MultiplyPayloadDto) {
    return this.expressionService.multiply(dto);
  }
}
