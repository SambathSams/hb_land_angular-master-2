import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../auth/services/authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router: Router,private authenticationservice: AuthenticationService) { }

  ngOnInit(): void {
  }
  logout() {
    this.router.navigate(['/auth/login'])

    // let username = sessionStorage.getItem('username');
    // this.authenticationservice.logOut();
    // (this.authenticationservice.authenticatelogout(username).subscribe(
    //   data => {},
    //   error => {}));
  }
}
