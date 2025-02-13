import { Component } from '@angular/core';

import {
  PoLinkModule,
  PoInfoModule,
  PoIconModule
} from '@po-ui/ng-components';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [PoLinkModule, PoInfoModule, PoIconModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
