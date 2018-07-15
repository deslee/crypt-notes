export class Loader<TValue, TError> {
    constructor() {
        this.state = LoaderState.INITIAL;
    }

    state: LoaderState;
    value?: TValue;
    error?: TError;
}

export enum LoaderState {
    INITIAL = 'INITIAL',
    LOADING = 'LOADING',
    LOADED = 'LOADED',
    ERROR = 'ERROR'
}
