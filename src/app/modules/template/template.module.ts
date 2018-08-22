import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateRoutingModule } from './template-routing.module';
import { V1Component } from './v1/v1.component';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TemplateRoutingModule
  ],
  declarations: [V1Component]
})
export class TemplateModule { }
