import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from 'passport-google-oauth20';
export type GoogleProfileUser = {
    googleId: string;
    email: string;
    userName: string;
    profilePicture?: string;
};
declare const GoogleStrategy_base: new (...args: [options: import("passport-google-oauth20").StrategyOptionsWithRequest] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class GoogleStrategy extends GoogleStrategy_base {
    private readonly ConfigService;
    constructor(ConfigService: ConfigService);
    authorizationParams(options: {
        accessType?: string;
        prompt?: string;
        hl?: string;
    }): Record<string, string>;
    validate(_accessToken: string, _refreshToken: string, profile: Profile): GoogleProfileUser;
}
export {};
