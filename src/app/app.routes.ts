import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DetailComponent } from './home/details/detail.component';


export const appRoutes: Routes = [
    { path: 'details/:id', component: DetailComponent},
    {path: '', component: HomeComponent}
];