import { IUser } from '@/interfaces/IUser';
import User from "../../domain/models/user";

declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }    
  }

  namespace Models {
    export type UserModel = User;
  }

}
