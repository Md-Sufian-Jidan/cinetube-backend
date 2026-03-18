import IRequestUser from "./IRequestUser";


declare global {
    namespace Express {
        interface Request {
            user?: IRequestUser;
        }
    }
}