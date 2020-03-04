class DataManager {
    constructor(props) {
        if(typeof props.name === 'string')
            this.name = props.name;
        else
            throw Error('Failed to construct DataManager. "name" must be a "string"');

        this.error = false;
        this.errorMessage = typeof props.errorMessage === 'string' ? props.errorMessage : null;
        this.loading = false;
        
        if(typeof props.initialFetchFunction === 'function')
            this.initialFetchFunction = props.initialFetchFunction;
        else
            throw Error('Failed to construct DataManager. "initialFetchFunction" must be a "function"');
    }
}