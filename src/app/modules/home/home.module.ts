import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home.component';
import { HomeAuthResolver } from './home-auth-resolver.service';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent],
  providers: [HomeAuthResolver]
})
export class HomeModule { }
