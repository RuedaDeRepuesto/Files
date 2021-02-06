export class User{
      email: string;
      id: number;
      name: string;
}

export class UserLoginResponse{
  access_token:string;
  token_type:string;
  remember_token:string;
  expires_in:number;
  user:User;
}