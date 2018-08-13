import { NgModule } from '@angular/core';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './pages/category.component';
import { SharedModule } from '../../shared';
import { CategoryResolver } from './category-resolver.service';

@NgModule({
  imports: [
    SharedModule,
    CategoryRoutingModule
  ],
  declarations: [CategoryComponent],
  providers: [CategoryResolver]
})
export class CategoryModule { }
