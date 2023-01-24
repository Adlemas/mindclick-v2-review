import { Body, Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ExpressionService } from 'src/expression/expression.service';
import { MentalPayloadDto } from 'src/expression/dto/mental-payload.dto';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { MultiplyPayloadDto } from 'src/expression/dto/mutliply-payload.dto';
import { DividePayloadDto } from 'src/expression/dto/divide-payload.dto';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { Roles } from 'src/users/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { MentalDocumentPayloadDto } from 'src/expression/dto/mental-documet-query.dto';

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

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('mental/document')
  mentalDocument(@Body() dto: MentalDocumentPayloadDto) {
    return dto;
  }

  @UseGuards(AccessTokenGuard)
  @Get('multiply')
  multiply(@Body() dto: MultiplyPayloadDto) {
    return this.expressionService.multiply(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('divide')
  divide(@Body() dto: DividePayloadDto) {
    return this.expressionService.divide(dto);
  }
}
