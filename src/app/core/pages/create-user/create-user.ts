import { Component } from '@angular/core';
import { FormUser } from "../../components/form-user/form-user.component";

@Component({
  selector: 'app-create-user',
  imports: [FormUser],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser {}
