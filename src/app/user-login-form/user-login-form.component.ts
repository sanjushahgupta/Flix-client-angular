import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { userName: '', password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public diagolRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  loginUser(): void {
    this.fetchApiData.login(this.userData).subscribe(
      (response) => {
        console.log('login response', response);
        this.diagolRef.close();
        this.snackBar.open('Login successful', 'OK', {
          duration: 2000,
        });
      },
      (response) => {
        console.log('login response', response);
        this.snackBar.open(response, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
