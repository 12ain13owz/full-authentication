import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Role } from '../../shared/models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly API_URL = environment.API_URL + 'api/v1/role';

  constructor(private http: HttpClient) {}

  getRoles() {
    return this.http.get<Role[]>(this.API_URL);
  }
}
