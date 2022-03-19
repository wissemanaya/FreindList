import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './account/account.module';

@Module({
  imports: [ MongooseModule.forRoot('mongodb+srv://Wissem:Wissem@cluster0.p65hl.mongodb.net/FreindList?retryWrites=true&w=majority')
    ,AccountModule],
 
})
export class AppModule {}
