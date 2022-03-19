import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from './accounst.schema';
import { Model } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { Z_DEFLATED } from 'zlib';
import { FreindshipStaus } from './freindship-status';
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

  async GetAccountById(id: String): Promise<Account> {
    const found = await this.accountModel.findById(id).exec();
    console.log(found);
    return found;
  }

  async SendRequest(id: string, idperson: string): Promise<void> {
    const myquery = await this.accountModel.findById(id);
    const personquery = await this.accountModel.findById(idperson);
    const MyUpdate = await this.accountModel
      .findByIdAndUpdate(id, {
        $push: { OutgoingRequests: personquery.name },
      })
      .exec();
    const persoupdate = await this.accountModel
      .findByIdAndUpdate(idperson, {
        $push: { IncomingRequests: myquery.name },
      })
      .exec();
  }

  async AcceptRequest(id: string, idperson: string): Promise<void> {
    // id: string my id
    // idperson: string   id of person who send a request
    /*const myquery = await this.accountModel.findById(id);
    const personquery = await this.accountModel.findById(idperson);
    const personname = personquery.name ; 
    const myfreindlist = myquery.freindlist ;
    if (myquery.IncomingRequests.includes(personname)){
           myquery.freindlist.push(personname)
           this.remove(personname,myquery.IncomingRequests)
           myquery.freindlist.push(myquery.name)
           this.remove(myquery.name,personquery.OutgoingRequests)
    }else{

    }*/
    this.AddFreind(id, idperson);
  }

  async AddFreind(id: string, idNewFreind: string): Promise<Account> {
    const myquery = await this.accountModel.findById(id);
    const myfreindquery = await this.accountModel.findById(idNewFreind);
    const MyUpdate = await this.accountModel
      .findByIdAndUpdate(id, {
        $push: { freindlist: myfreindquery.name },
        $set: {
          IncomingRequests: this.remove(
            myfreindquery.name,
            myquery.IncomingRequests,
          ),
        },
      })
      .exec();

    const MyFreinfUpdate = await this.accountModel
      .findByIdAndUpdate(idNewFreind, {
        $push: { freindlist: myquery.name },
        $set: {
          OutgoingRequests: this.remove(
            myquery.name,
            myfreindquery.OutgoingRequests,
          ),
        },
      })
      .exec();
    return null;
  }

  async checklist(id: String, idperson: string): Promise<void> {
    let difference = new Map<string, string>();
    const myaccount = await this.accountModel.findById(id).exec();
    const personaccount = await this.accountModel.findById(idperson).exec();
    const personfreinds = personaccount.freindlist;
    for (let j in personfreinds) {
      if (myaccount.freindlist.includes(personfreinds[j]) && ((personfreinds[j] != myaccount.name))) {
        difference.set(personfreinds[j], FreindshipStaus.FREIND);
      } else if (myaccount.OutgoingRequests.includes(personfreinds[j])&& ((personfreinds[j] != myaccount.name))) {
        difference.set(personfreinds[j], FreindshipStaus.REQUESTED);
      } else if ((personfreinds[j] != myaccount.name)){
        difference.set(personfreinds[j], FreindshipStaus.CONNECT);
      }
    }
    console.log(difference) ;
  }

  async remove(value, arr) {
    console.log('here');
    return arr.filter((item) => item !== value);
  }
}
