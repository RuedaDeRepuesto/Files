import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertService } from '../_services/alert.service.service';
import { AuthService } from '../_services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username:string;
  password:string;

  constructor(private alertService:AlertService,private authService:AuthService,private router:Router) { }

  ngOnInit() {
    this.username = '';
    this.password = '';
    if(!environment.production)
    {
      this.username="admin@kgames.cl";
      this.password="Files!";
    }
  }

  async login(){
    if(this.username.length> 0 && this.password.length>0)
    {
      try {
        var loader = await this.alertService.showLoader('Iniciando sesión');
        var user = await this.authService.login(this.username,this.password);
        loader.message = 'Entrando...'
        await this.router.navigate(['/files'],{replaceUrl: true});
        loader.dismiss();

      } catch (error) {
        await this.alertService.showError(error.message);
      }
    }
    else{
      await this.alertService.showError('Debes ingresar los campos');
    }
  }

}
