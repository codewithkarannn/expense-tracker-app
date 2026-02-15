import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavBar} from '../../components/shared/nav-bar/nav-bar';
import {ConfirmationDialog} from '../../components/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    NavBar,
    ConfirmationDialog
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

}
