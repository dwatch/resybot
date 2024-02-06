import { Module } from '@nestjs/common'
import { UtilityFunctions } from './utility.functions';

@Module({
  providers: [UtilityFunctions],
  exports: [UtilityFunctions]
})
export class UtilityModule {}
