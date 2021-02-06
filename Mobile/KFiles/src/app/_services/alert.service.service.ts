import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(public alertController: AlertController, public loadingController:LoadingController) { }


  public async showError(errorMessage:string, okBtn = 'Ok'){
    const alert = await this.alertController.create({
      cssClass: 'error-alert',
      header: 'Error',
      translucent:true,
      message: (errorMessage)? errorMessage : 'Ocurrrio un error inesperado',
      buttons: [okBtn]
    });

    return alert.present();
  }

  public async showLoader(texto:string = 'Cargando...'){
    let load = await this.loadingController.create(
      {
        translucent:true,
        message:texto,
        duration:99999999,
        backdropDismiss:false
      }
        );
    await load.present();
    return load;
  }
}
