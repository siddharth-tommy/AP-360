import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { AssertproComponent } from "./assertpro/assertpro.component";
import { AuthGuard } from "../share/guards/auth.guard";
const routes: Routes = [
  {
    path: "home",
    component: AssertproComponent,
    children: [
      {
        path: 'pagemap',
        loadChildren: './hompagemap/homepagemap.module#HomePageMapModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
        canActivate: [AuthGuard]
      },
      {
        path: "asset",
        loadChildren: './assets/assets.module#AssetsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'userdirectory',
        loadChildren: './usersdirectory/usersdirectory.module#UsersDirectoryModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'reports',
        loadChildren: './reports/reports.module#ReportsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'tracker',
        loadChildren: './tracker/tracker.module#TrackerModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'messaging',
        loadChildren: './messaging/message.module#MessageModule',
        canActivate: [AuthGuard]
      },
      {
        path: "notification",
        loadChildren: './notification/notification.module#NotificationModule',
        canActivate: [AuthGuard]
      },
      {
        path: "configuration",
        loadChildren: './configuration/configuration.module#ConfigurationModule',
        canActivate: [AuthGuard]
      },
      {
        path: "admin",
        loadChildren: './admin/admin.module#AdminModule',
        canActivate: [AuthGuard]
      },
       {
       path: "pdfreport",
        loadChildren: './reports/components/pdfreport/pdfreport.module#PdfReportModule',
        canActivate: [AuthGuard]
       }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
