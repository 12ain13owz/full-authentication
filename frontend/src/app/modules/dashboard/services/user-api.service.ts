import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UpdateUserResponse, User } from '../../../shared/models/user.model';
import { ApiResponse } from '../../../shared/models/shared.model';

@Injectable()
export class UserApiService {
  private readonly API_URL = environment.API_URL + 'api/v1/users';

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<User[]>(this.API_URL);
  }

  findByEmail(email: string) {
    return this.http.get<User>(this.API_URL + '/email/' + email);
  }

  update(id: number, body: Partial<User>) {
    return this.http.patch<UpdateUserResponse>(
      this.API_URL + '/user/' + id,
      body
    );
  }

  updateUserRoles(id: number, body: Partial<User>) {
    return this.http.patch<ApiResponse<null>>(
      this.API_URL + '/roles/' + id,
      body
    );
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<null>>(this.API_URL + '/' + id);
  }
}
