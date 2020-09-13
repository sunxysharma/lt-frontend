import { Component  } from '@angular/core';
import {
  Router,
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart
} from '@angular/router';
declare let mdc: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ltrx-frontend';
  loading = false;
  constructor( private router: Router){
    this.router.events.subscribe((event: Event) => {
      switch (true) {
      case event instanceof NavigationStart: {
        this.loading = true;
        break;
      }
      case event instanceof NavigationEnd:
      case event instanceof NavigationCancel:
      case event instanceof NavigationError: {
        this.loading = false;
        mdc.autoInit(document, () => { });
        break;
      }
      default: {
        break;
      }
      }
    });
  }
}
