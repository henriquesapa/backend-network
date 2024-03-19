// import jwt from 'jsonwebtoken';
// import moment from 'moment-timezone';
// import { http_status_code } from '../interface/Ihttp_status';
// import {throwError} from '../lib/custom_error';
// import { App } from '../server';
// import { ITokenData } from '../interface/Ilogin.interface';

// export class JWT {
//     private static async signAccessToken(user : ITokenData){
//         const secret = App.getJwt;
//         const token = jwt.sign(
//             user,
//             secret.access_token,
//             {  expiresIn:process.env.NODE_ENV != 'PRODUCTION' ? '99999m' : '15s' }


//         );
//         return token;
//     }

//     private static async signAccessToken(user: ITokenData){
//         const secret = App.getJwt;
//         const token = jwt.sign(
//             {...user,
//                 expat: user.expat == 0 ? (moment().toDate().valueOf()/1000) + (8 * 60 * 60 * 1000) : user.expat},
//                 secret.refresh_token,
//                 { expiresIn:process.env.NODE_ENV != 'PRODUCTION' ? '99999m' : '30m' }
//         );
//         return token;
//     }
// }
