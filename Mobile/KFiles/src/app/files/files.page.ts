import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, PopoverController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { File } from '../_models/File';
import { FileUpload } from '../_models/fileupload';
import { UserLoginResponse } from '../_models/User';
import { AlertService } from '../_services/alert.service.service';
import { AuthService } from '../_services/auth-service.service';
import { FileService } from '../_services/file.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.page.html',
  styleUrls: ['./files.page.scss'],
})
export class FilesPage implements OnInit {

  
  files:File[] = [];

  loading = false;

  uploads:FileUpload[] = [];

  userSesion:UserLoginResponse;

  constructor(private fileService:FileService, private alertService:AlertService,
            private actionSheetController:ActionSheetController,
            private authService:AuthService) { }

  ngOnInit() {
    this.userSesion = this.authService.getUser;
    this.refresh();
  }

  async refresh(){
    this.loading = true;
    await this.loadFiles();
    this.loading = false;
  }

  async loadFiles(){
    try {
      this.files = await this.fileService.getAll();
      console.log(this.files);
    } catch (error) {
      await this.alertService.showError(error.message);
    }
  }


  async removeUpload(obj:FileUpload)
  {
    this.uploads.splice(this.uploads.indexOf(obj),1);
  }

  async fileUpload(event)
  {
    
    const file = (<HTMLInputElement>document.getElementById('archivo')).files.item(0);
    console.log(file);
    let controller = this;
    let upload = new FileUpload();
    upload.uploading = true;
    upload.fileName = file.name;
    upload.progress = 0;

    this.uploads.push(upload);

    this.fileService.post(file).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Enviado');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Recibido el header');
          break;
        case HttpEventType.UploadProgress:
          upload.progress = Math.round(event.loaded / event.total * 100)
          //this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Subiendo ${upload.progress}%`);
          break;
        case HttpEventType.Response:
          console.log('Terminado!', event.body);
          setTimeout(() => {
            upload.finished = true;
            upload.uploading = false;
            controller.loadFiles();
          }, 1500);

      }
    }, (error) =>
    {
      this.alertService.showError(error.message);
      upload.uploading = false;
      upload.finished = false;
      upload.error = true;
    });
  }


  async fileMenu(event,file){
    console.log(event);
    console.log(file);

    const actionSheet = await this.actionSheetController.create({
      header: file.name,
      cssClass: 'app-sheet',
      translucent:true,
      buttons: [
       {
        text: 'Descargar',
        icon: 'cloud-download-outline',
        handler: () => {
          this.downloadFile(file);
        }
      }, {
        text: 'Cambiar nombre',
        icon: 'pencil-outline',
        handler: () => {
          this.changeName(file);
        }
      },{
        text: 'Eliminar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.deleteFile(file);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
    
  }
  

  async changeName(file:File){
    const input = await  this.alertService.alertController.create({
      cssClass:'app-alert',
      translucent:true,
      header:'Cambiar nombre:',
      inputs:[{
        name: 'name',
        type: 'text',
        placeholder: 'Nuevo nombre'
      }],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (event) => {
            this.changeNameConfirm(file,event);
          }
        }
      ]
    });
    await input.present();
  }

  async downloadFile(file:File)
  {
    window.open(`${environment.APIurl}file/${file.id}/file?token=${this.userSesion.access_token}`);
  }

  async changeNameConfirm(file:File,el){
    file.filename = el.name;
    this.updateFile(file);
  }

  async updateFile(file:File){
    const loader = await this.alertService.showLoader('Cambiando nombre...');
    try {
      const req = await this.fileService.put(file);
      await loader.dismiss();
    } catch (error) {
      await loader.dismiss();
      this.alertService.showError(error.message);
    }
  }

  async deleteFile(file:File)
  {
    const loader = await this.alertService.showLoader('Eliminando...');
    try {
      const req = await this.fileService.delete(file);
      await this.loadFiles();
      await loader.dismiss();
    } catch (error) {
      await loader.dismiss();
      this.alertService.showError(error.message);
    }
  }

}
