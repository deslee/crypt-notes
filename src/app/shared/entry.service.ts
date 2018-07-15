import { Injectable } from '@angular/core';
import { of, concat, Observable, BehaviorSubject } from 'rxjs';
import { utc } from 'moment';
import { Entry as EntryModel } from './entry.model';
import { Loader, LoaderState } from './loader.model';
import { CryptoService } from './crypto.service';

type Entries = Loader<EntryModel[], string>;
type Entry = Loader<EntryModel, string>;
const ENTRIES_CYPHER_TEXT_KEY = 'entriesCypherText';
const ENTRIES_PASSWORD_KEY = 'entriesPassword';

@Injectable({
    providedIn: 'root'
})
export class EntryService {
    private entries: BehaviorSubject<Entries>;

    constructor(private cryptoService: CryptoService) {
        this.entries = new BehaviorSubject<Entries>({
            state: LoaderState.LOADING
        });

        if (this.isUnlocked()) {
            const entries = this.getEntriesFromPersist();
            this.entries.next({
                state: LoaderState.LOADED,
                value: entries
            });
        }
    }

    isUnlocked(): boolean {
        const password = sessionStorage.getItem(ENTRIES_PASSWORD_KEY);
        return password !== null && password !== undefined;
    }

    unlock(password: string): void {
        const hashedPassword = this.cryptoService.hash(password);
        const entries = this.getEntriesFromPersist(hashedPassword);
        this.entries.next({
            state: LoaderState.LOADED,
            value: entries
        });
        sessionStorage.setItem(ENTRIES_PASSWORD_KEY, hashedPassword);
    }

    lock(): void {
        sessionStorage.removeItem(ENTRIES_PASSWORD_KEY);
    }

    getEntries(): Observable<Entries> {
        return this.entries.asObservable();
    }

    updateEntries(entries: EntryModel[]): Promise<void> {
        entries = this.cloneDeep(entries);
        return new Promise((resolve, reject) => {
            try {
                const password = sessionStorage.getItem(ENTRIES_PASSWORD_KEY);
                const cypherText = this.cryptoService.encrypt(password, entries);
                localStorage.setItem(ENTRIES_CYPHER_TEXT_KEY, cypherText);
                this.entries.next({
                    state: LoaderState.LOADED,
                    value: entries
                });
                resolve();
            } catch (error) {
                reject(error.toString());
            }
        });
    }

    newEntry(): Promise<EntryModel> {
        const entry: EntryModel = {
            id: this.cryptoService.guid(),
            date: utc().format(),
            title: '',
            text: '',
            tags: []
        };

        return new Promise<EntryModel>((resolve, reject) => {
            try {
                const entries = [
                    ...this.getEntriesFromPersist(),
                    entry
                ];

                this.updateEntries(entries)
                    .then(() => resolve(this.cloneDeep(entry)))
                    .catch(err => reject(err.toString()));
            } catch (e) {
                reject(e.toString());
            }
        });
    }

    updateEntry(entry: EntryModel): Promise<void> {
        entry = this.cloneDeep(entry);
        return new Promise<void>((resolve, reject) => {
            try {
                const entries = this.getEntriesFromPersist()
                    .map(e => {
                        if (e.id === entry.id) {
                            return entry;
                        } else {
                            return e;
                        }
                    });

                this.updateEntries(entries)
                    .then(() => resolve())
                    .catch(err => reject(err.toString()));
            } catch (e) {
                reject(e.toString());
            }
        });
    }

    deleteEntry(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const entries = this.getEntriesFromPersist().filter(e => e.id !== id);
                this.updateEntries(entries)
                    .then(() => resolve())
                    .catch(err => reject(err.toString()));
            } catch (e) {
                reject(e.toString());
            }
        })
    }

    private getEntriesFromPersist(hashedPassword?: string): EntryModel[] {
        const entriesCypherText = localStorage.getItem(ENTRIES_CYPHER_TEXT_KEY);
        const password = hashedPassword || sessionStorage.getItem(ENTRIES_PASSWORD_KEY);

        let value: EntryModel[];
        if (!entriesCypherText) {
            value = [];
        } else {
            value = this.cryptoService.decrypt(password, entriesCypherText);
        }

        return value;
    }

    private cloneDeep<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }
}
