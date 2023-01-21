import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get(key: string, throwOnMissing = true): string {
    const value = process.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  getPort(): number {
    return parseInt(this.get('PORT', false), 10) || 8080;
  }

  getMongoUri(): string {
    return this.get('MONGO_URI');
  }

  getAdminEmail(): string {
    return this.get('ADMIN_EMAIL');
  }

  getJwtSecret(): string {
    return this.get('JWT_SECRET');
  }

  getAccessTokenExpiresIn(): string {
    return this.get('ACCESS_TOKEN_EXPIRES_IN');
  }

  getRefreshTokenExpiresIn(): string {
    return this.get('REFRESH_TOKEN_EXPIRES_IN');
  }

  getRefreshTokenRememberMeExpiresIn(): string {
    return this.get('REFRESH_TOKEN_REMEMBER_EXPIRES_IN');
  }

  getMailUser(): string {
    return this.get('MAIL_USER');
  }

  getMailPassword(): string {
    return this.get('MAIL_PASS');
  }

  getMailHost(): string {
    return this.get('MAIL_HOST');
  }

  getMailPort(): number {
    return parseInt(this.get('MAIL_PORT', false), 10) || 587;
  }

  getAwsBucketName(): string {
    return this.get('AWS_BUCKET');
  }

  getAwsRegion(): string {
    return this.get('AWS_REGION');
  }

  getAwsAccessKey(): string {
    return this.get('AWS_ACCESS');
  }

  getAwsSecretKey(): string {
    return this.get('AWS_SECRET');
  }

  getTinkoffTerminalKey(): string {
    return this.get('TINKOFF_TERMINAL_KEY');
  }

  getTinkoffSecretKey(): string {
    return this.get('TINKOFF_TERMINAL_PASSWORD');
  }
}
