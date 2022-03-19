import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Body } from '@nestjs/common';
import { Account } from './accounst.schema';
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}


  @Post('/signup')
  async signUp(@Body() createAccountDto: CreateAccountDto): Promise<void> {
    return this.accountService.signUp(createAccountDto) ;
  }

  @Get('/account')
  async getAllAccounts() {
    const accounts = await this.accountService.GetAccounts();
    return accounts;
  }


  @Get('/:id')
  GetAccountById(@Param('id') id: string): Promise<Account> {
    return this.accountService.GetAccountById(id);
  }




  @Patch('/:id/:idperson')
  async SendRequest(@Param('id') id: string,@Param('idperson')idperson : string): Promise<void> {
    return await this.accountService.SendRequest(id , idperson);
  }

 
  @Patch('request/:id/:idperson')
  async AcceptRequest(@Param('id') id: string,@Param('idperson')idperson : string): Promise<void> {
    return await this.accountService.AcceptRequest(id , idperson);
  }

  

  @Get('/:id/:idperson')
  async checklist(@Param('id') id: string,@Param('idperson')idperson : string) : Promise<any> {
    return await this.accountService.checklist(id , idperson);
  }

  
}
