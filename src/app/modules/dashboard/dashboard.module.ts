import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routesDashboard } from './dashboard-routing';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routesDashboard)
  ],
  exports: [RouterModule]
})
export class DashboardModule { }
