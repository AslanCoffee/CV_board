import { IsEmail } from "class-validator";
export class CreateUserDto {
    id: number;
    name: string;
    @IsEmail()
    email?: string;
    department?: string;
}
