import { UserRole } from "../../generated/prisma/enums";

interface IRequestUser {
    userId: string;
    email: string;
    role: UserRole;
}

export default IRequestUser;