import { APIRequestContext, APIResponse, expect, request } from "@playwright/test";
import testData from "../test data/dataDrivenTestData.json";

const BASE_URL = testData.urls.basePage;
const LOGIN_ENDPOINT = testData.urls.loginApiEndpoint;

export type LoginCredentials = {
    userEmail: string;
    userPassword: string;
};

export class AuthApi {
    private constructor(private apiContext: APIRequestContext) {}

    static async create(): Promise<AuthApi> {
        const apiContext = await request.newContext({ baseURL: BASE_URL });
        return new AuthApi(apiContext);
    }

    // returns the raw response so negative cases can assert on status and message
    async attemptLogin({ userEmail, userPassword }: LoginCredentials): Promise<APIResponse> {
        return this.apiContext.post(LOGIN_ENDPOINT, { data: { userEmail, userPassword } });
    }

    // returns the token of a successful login
    async login(credentials: LoginCredentials): Promise<string> {
        const loginResponse = await this.attemptLogin(credentials);
        expect(loginResponse.ok(), `Login failed for ${credentials.userEmail}`).toBeTruthy();
        const loginResponseJson = await loginResponse.json();
        return loginResponseJson.token;
    }
}
