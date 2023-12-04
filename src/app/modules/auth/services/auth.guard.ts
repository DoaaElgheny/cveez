import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Constants } from 'src/app/services/Constants/constants';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  cveezJobSeekerRouteCanRoute=[]
  admin=[]
  agentRouteCanRoute=[]

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (localStorage.getItem('access_token_cveez')) {
    //  return this.checkRouteAndPermission();
    return true
    } else {
      this.authService.logout();
      return false;
    }
  }

  canLoad(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (localStorage.getItem('access_token_cveez')) {
      this.goToFirsRoute();
    }
  }

  goToFirsRoute() {
    const route = location.href;
    // if (route == '') {
    //   if (
    //     this.authService.getCurrentUser().roles[0] ==
    //     Constants.AllRoles.cveezSuperAdmin
    //   ) {
    //     this.router.navigate(['/admin']);
    //   } else {
    //     this.router.navigate(['/service-provider']);
    //   }
    // }
  }
  checkRouteAndPermission(): boolean {
    let route = location.href.toString();
    if (
      route != '' &&
      location.pathname != '/' &&
      !location.pathname.includes('auth')
    ) {
      if (
        this.authService.getCurrentUser().roles[0] ==
          Constants.AllRoles.cveezSuperAdmin &&
        route.includes('admin')
      ) {
        return true;
      } else if (
        this.authService.getCurrentUser().roles[0] ==
          Constants.AllRoles.cveezJobSeeker &&
        route.includes('client')
      ) {
        return true;
      } else {
        this.router.navigate(['/error/505']);
        return false;
      }
    } else {
      return true;
    }
  }
}
