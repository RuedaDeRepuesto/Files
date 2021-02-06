import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { GuestGuard } from './_guards/guest.guard';

const routes: Routes = [
  {path: '', redirectTo:'/files', pathMatch: 'full'},
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canLoad:[GuestGuard]
  },
  {
    path: 'files',
    loadChildren: () => import('./files/files.module').then( m => m.FilesPageModule),
    canLoad:[AuthGuard]
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
