import { Injectable } from '@angular/core';
import { of, concat, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Entry } from './entry.model';
import { Loader, LoaderState } from './loader.model';
import { CryptoService } from './crypto.service';

type Entries = Loader<Entry[], string>;
const ENTRIES_CYPHER_TEXT_KEY = 'entriesCypherText';
const ENTRIES_PASSWORD_KEY = 'entriesPassword';

@Injectable({
    providedIn: 'root'
})
export class EntryService {
    constructor(private cryptoService: CryptoService) {}

    isUnlocked(): boolean {
        const password = sessionStorage.getItem(ENTRIES_PASSWORD_KEY);
        return password !== null && password !== undefined;
    }

    unlock(password: string): void {
        const hashedPassword = this.cryptoService.hash(password);
        sessionStorage.setItem(ENTRIES_PASSWORD_KEY, hashedPassword);
    }

    lock(): void {
        sessionStorage.removeItem(ENTRIES_PASSWORD_KEY);
    }

    getEntries(): Observable<Entries> {
        const initialValue: Observable<Entries> = of({
            state: LoaderState.LOADING
        });
        const entriesCypherText = localStorage.getItem(ENTRIES_CYPHER_TEXT_KEY);
        const password = sessionStorage.getItem(ENTRIES_PASSWORD_KEY);

        let value: Observable<Entries>;
        if (!entriesCypherText) {
            value = of({
                state: LoaderState.LOADED,
                value: []
            });
        } else {
            try {
                value = of({
                    state: LoaderState.LOADED,
                    value: this.cryptoService.decrypt('', entriesCypherText)
                });
                console.log(value);
            } catch (error) {
                value = of({
                    state: LoaderState.ERROR,
                    error: error.toString()
                });
            }
        }

        return concat(initialValue, value);
    }

    updateEntries(entries: Entry[]): Observable<void> {
        return new Observable<void>(observer => {
            try {
                const password = sessionStorage.getItem(ENTRIES_PASSWORD_KEY);
                const cypherText = this.cryptoService.encrypt(password, entries);
                localStorage.setItem(ENTRIES_CYPHER_TEXT_KEY, cypherText);
                observer.complete();
            } catch (error) {
                observer.error(error.toString());
            }
        });
    }
}
