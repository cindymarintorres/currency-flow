export interface User {
  sub: string;
  name: string;
  email: string;
  admin?: boolean;
  iat?: number;
}