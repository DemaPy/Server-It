import { User } from "@prisma/client";

export class CreateUserDTO {
  email: User["email"];
  password: User["password"];
  constructor(data: any) {
    this.email = data.email;
  }
}
