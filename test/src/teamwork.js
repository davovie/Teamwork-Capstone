class apiResponse {
    
    constructor(api) {
        this.route = api;
        this.response = false;
    }

    createUser() {
        if (this.route === '/auth/create-user') {
            return this.response = true;
        }
        return this.response = false;
    }

    status() {
        if(this.response) {
            return 201;
        }
        return 400;
    }
}

