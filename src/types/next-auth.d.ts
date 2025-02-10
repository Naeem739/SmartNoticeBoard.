import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session{
        user:{
            id?: string | undefined;
            name?: string | null;
            email?:string | null;
        } & DefaultSession['user']
       

    }
    interface Token{
        name:string ;
        email:string ;
        sub:email;
    }

}
declare module 'next-auth' {
    interface Token{
        name:string;
        email:string;
        sub:string;
        id:string
    }

}