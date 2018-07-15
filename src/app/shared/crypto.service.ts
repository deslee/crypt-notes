import { Injectable } from '@angular/core';
import sjcl from 'sjcl';

@Injectable({
    providedIn: 'root'
})
export class CryptoService {
    hash(data: string): string {
        return btoa(JSON.stringify(sjcl.hash.sha256.hash(data)));
    }
    encrypt(password: string, value: any): string {
        const json = JSON.stringify(value);
        return sjcl.encrypt(password, json);
    }

    decrypt(password: string, value: string): any {
        const json = sjcl.decrypt(password, value);
        return JSON.parse(json);
    }

    guid(): string {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
      }
}
