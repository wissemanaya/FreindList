import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


export type AccountDocument = Account & Document;

@Schema()
export class Account {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  _id: string;

  

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  freindlist: string[];

  @Prop({ required: true })
  OutgoingRequests: string[];

  @Prop({ required: true })
  IncomingRequests: string[];
}

export const AccountSchema = SchemaFactory.createForClass(Account);
