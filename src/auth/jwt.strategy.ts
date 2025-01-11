import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwtAuth') {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
      secretOrKey: configService.get<string>('ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // payload contains the decoded JWT token
    // You can fetch additional user data from your database here
    const user = await this.usersService.getUserById(payload.sub);

    // Return the data you want to attach to the request
    return {
      email: payload.email,
      username: payload.username,
      occupation: payload.occupation,
      createdAt: payload.createdAt,
      whyStatements: payload.whyStatements,
      savedQuotes: payload.savedQuotes,
      favoritePersonalities: payload.favoritePersonalities,
      fistBumps: payload.fistBumps,
      ...user,
    };
  }
}
