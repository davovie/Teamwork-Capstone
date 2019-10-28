//Write test for Teamwork App
describe('TeamWork App', () => {
    // test for rest API endpoint when admin creates an employee user account
    describe('when admin submits user form', () => {
        let res;
        let req = '/auth/create-user';

        beforeEach(() => {
            res = new apiResponse(req);
        });

        it('should return a response status of success', () => {
            res.createUser()
            expect(res.status()).toEqual(201);
        });
    });
});