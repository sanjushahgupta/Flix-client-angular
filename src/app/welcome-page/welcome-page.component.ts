import { Component, OnInit } from '@angular/core';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { MatDialog } from '@angular/material/dialog';

const TypeDoc = require('typedoc');

/** WelcomePageComponent is a component representing the welcome page => to display a welcome page with registartion and login dialog */
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
  /**
   * Constructor for WelcomePageComponent
   * @param {MatDialog} dialog - to open dialogs
   */
  constructor(public dialog: MatDialog) {}

  /** after component initialization -> Lifecycle hook is called*/
  ngOnInit(): void {}

  /** Opens the user registration dialog as form.*/
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }

  /** Opens the user login dialog as form.*/
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }
}
