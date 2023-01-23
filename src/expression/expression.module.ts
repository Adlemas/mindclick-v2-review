import { Module } from '@nestjs/common';
import { ExpressionController } from './expression.controller';

@Module({
  controllers: [ExpressionController],
})
export class ExpressionModule {}
