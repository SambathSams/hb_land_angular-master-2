import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandComponent } from './land.component';
import { HomeComponent } from './home/home.component';
import { ViewlandComponent } from './viewland/viewland.component';
import { AddlandComponent } from './addland/addland.component';
import { EditlandComponent } from './editland/editland.component';
import {MatIconModule} from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../shared-module/shared.module';

const routes: Routes = [
    {
        path: '',
        component: LandComponent,
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            
              },            { path: 'view/:id', component: ViewlandComponent },
            { path: 'home', component: HomeComponent },
        ],
    },
];
@NgModule({
    declarations: [LandComponent, ViewlandComponent, HomeComponent,    AddlandComponent,
        EditlandComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,MatIconModule,MatTableModule,
        RouterModule.forChild(routes), ReactiveFormsModule, FormsModule,SharedModule
    ]
})
export class LandModule { }
