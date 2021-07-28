import { RestClient } from 'core/transport/RestClient';
import { ApiResponsePayload, SignInRequest, SignInResponse } from 'core/models';
import Config from 'core/Config';

class AuthRestClient extends RestClient {
  login = (credentials: SignInRequest) => (
    this.post<SignInRequest, ApiResponsePayload<SignInResponse>>(
      `${this._apiUrl}${Config.routes.login}`,
      credentials,
    )
  );

  loginMock = (credentials: SignInRequest) => (
    new Promise((resolve, reject) => {
      console.log('loginMock', credentials);
      setTimeout(() => {
        const response = {
          id: 1,
          email: 'test@test.com',
          fullName: 'John Doe',
          role: 'admin'
        };
        resolve(response);
        // reject();
      }, 500)
    })
  );
}

export const authRestClient = new AuthRestClient({});