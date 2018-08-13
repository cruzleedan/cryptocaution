import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './pages/category.component';
import { CategoryResolver } from './category-resolver.service';


const routes: Routes = [
    {
        path: '',
        component: CategoryComponent
    },
    {
        path: ':id',
        component: CategoryComponent,
        resolve: {
            category: CategoryResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoryRoutingModule { }
