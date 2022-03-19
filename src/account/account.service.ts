import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from './accounst.schema';
import { Model } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { Z_DEFLATED } from 'zlib';
@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}
  async signUp(createAccountDto: CreateAccountDto): Promise<void> {
    const { name } = createAccountDto;
    const newAccount = new this.accountModel({
      name,
    });
    const result = await newAccount.save();
    console.log(name);
  }

  async GetAccounts() {
    const accounts = await this.accountModel.find().exec();
    return accounts;
  }

  async GetRequestsById(id: String): Promise<Account> {
    const found = await this.accountModel.findById(id).exec();
    console.log(found);
    return found;
  }

  async AddFreind(id: string, idNewFreind: string): Promise<Account> {
    //const myaccount = await this.accountModel.findById(id);
    //const newfreindaccount = await this.accountModel.findById(idNewFreind);
    const myfilter = { _id: id };
    const myfreindfilter = { _id: idNewFreind };
    const myquery = await this.accountModel.findById(id);
    const myname = myquery.name;
    const myfreindquery = await this.accountModel.findById(idNewFreind);
    const myfreindname = myfreindquery.name;
    const MyUpdate = await this.accountModel
      .findByIdAndUpdate(myfilter, {
        $push: { freindlist: myfreindname },
      })
      .exec();

    const MyFreinfUpdate = await this.accountModel
      .findByIdAndUpdate(myfreindfilter, {
        $push: { freindlist: myname },
      })
      .exec();
    console.log(MyFreinfUpdate, MyUpdate);
    return null;
  }

  /*async checklist(id: String, idperson: string): Promise<void> {
    const myaccount = await this.accountModel.findById(id).exec();
    const personaccount = await this.accountModel.findById(idperson).exec();
    /*console.log(myaccount.freindlist) ;*/
    /*const freinds = myaccount.freindlist;
    const personfreinds = personaccount.freindlist;
    console.log(freinds);
    console.log(personfreinds);
    for (let i in freinds) {
      for (let j in personfreinds) {
        //if ((personfreinds[i], { $eq: freinds[j] })) {
          if (freinds[i]==  personfreinds[j] ) {
          console.log('in ur freindlist',freinds[i] );
        } else {
          console.log('add freind',personfreinds[j] );
        }
      }
    }
  }*/

  async checklist(id: String, idperson: string): Promise<void> {
    let difference = new Map<string, string>();
    const myaccount = await this.accountModel.findById(id).exec();
    const personaccount = await this.accountModel.findById(idperson).exec();
    const freinds = myaccount.freindlist;
    const personfreinds = personaccount.freindlist;
      for (let j in personfreinds) {
          if (freinds.includes(personfreinds[j])){
            difference.set(personfreinds[j] , "comun freind")
          }else {
            difference.set(personfreinds[j] , "add this freind")
          }
      }
    console.log(difference) ;
  }

}
