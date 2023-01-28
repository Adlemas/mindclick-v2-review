import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ExpressionService } from 'src/expression/expression.service';
import { MentalPayloadDto } from 'src/expression/dto/mental-payload.dto';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { MultiplyPayloadDto } from 'src/expression/dto/mutliply-payload.dto';
import { DividePayloadDto } from 'src/expression/dto/divide-payload.dto';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { Roles } from 'src/users/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { MentalDocumentPayloadDto } from 'src/expression/dto/mental-documet-query.dto';

import type { Response } from 'express';
import { MultiplyDocumentPayloadDto } from 'src/expression/dto/multiply-document-payload.dto';
import { DivideDocumentPayloadDto } from 'src/expression/dto/divide-document-payload.dto';
import { RewardPayloadDto } from 'src/expression/dto/reward-payload.dto';

@Controller('expression')
export class ExpressionController {
  @Inject(ExpressionService)
  private readonly expressionService: ExpressionService;

  @UseGuards(AccessTokenGuard)
  @Post('mental')
  mental(@Body() dto: MentalPayloadDto) {
    return this.expressionService.mental({
      ...dto,
      isBiggerMax: dto.isBiggerMax ?? false,
    });
  }

  @Roles(Role.TEACHER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('mental-document')
  mentalDocument(@Query() dto: MentalDocumentPayloadDto, @Res() res: Response) {
    // dynamic set content-type to pdf if fileFormat is pdf or xlsx
    if (dto.fileFormat === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
    } else if (dto.fileFormat === 'excel') {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
    }
    this.expressionService
      .mentalDocument({
        ...dto,
        terms: parseInt(dto.terms.toString(), 10),
        pageCount: parseInt(dto.pageCount.toString(), 10),
        min: parseInt(dto.min.toString(), 10),
        max: parseInt(dto.max.toString(), 10),
        hCount: parseInt(dto.hCount.toString(), 10),
        vCount: parseInt(dto.vCount.toString(), 10),
        isAutoHeight: dto.isAutoHeight.toString() === 'true',
        byPage: dto.byPage.toString() === 'true',
        byRows: parseInt(dto.byRows.toString(), 10),
        isGrow: dto.isGrow.toString() === 'true',
        isGrowByRows: dto.isGrowByRows.toString() === 'true',
        withRight: dto.withRight.toString() === 'true',
        design: dto.design.toString() === 'true',
      })
      .subscribe((stream) => {
        stream.getStream().pipe(res);
      });
  }

  @UseGuards(AccessTokenGuard)
  @Post('multiply')
  multiply(@Body() dto: MultiplyPayloadDto) {
    return this.expressionService.multiply(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('multiply-document')
  multiplyDocument(@Body() dto: MultiplyDocumentPayloadDto) {
    return this.expressionService.multiplyDocument(
      {
        first: dto.first,
        second: dto.second,
      },
      {
        rows: dto.rows,
        columns: dto.columns,
      },
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post('divide')
  divide(@Body() dto: DividePayloadDto) {
    return this.expressionService.divide(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('divide-document')
  divideDocument(@Body() dto: DivideDocumentPayloadDto) {
    return this.expressionService.divideDocument(
      {
        first: dto.first,
        second: dto.second,
      },
      {
        rows: dto.rows,
        columns: dto.columns,
      },
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post('reward')
  reward(@Req() req, @Body() dto: RewardPayloadDto) {
    return this.expressionService.reward(req.user, dto);
  }
}
