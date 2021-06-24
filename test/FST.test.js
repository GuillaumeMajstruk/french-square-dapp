const FST = artifacts.require("FST");

contract("FST", async accounts => {
    it('slould put 1000000000 to the first account', async () => {
        const instance = await FST.deployed();
        const balance = await instance.balanceOf.call(accounts[0]);
        assert.equal(balance.valueOf(), 1000000000);
    });

    it('should transfer 100 FST from account[0] to account[1]', async () => {
        const instance = await FST.deployed();

        //defining start parameters for test
        const account0 = accounts[0];
        const account1 = accounts[1];
        const amount = 100;
        let tmpBalance = await instance.balanceOf.call(account0);
        const account0_balance_start = tmpBalance.toNumber();
        tmpBalance = await instance.balanceOf.call(account1);
        const account1_balance_start = tmpBalance.toNumber();

        await instance.transfer(account1, amount, {from: account0});
        balance = await instance.balanceOf.call(account0);
        const account0_balance_end = balance.toNumber();
        balance = await instance.balanceOf.call(account1);
        const account1_balance_end = balance.toNumber();

        assert.equal(
            account0_balance_end,
            account0_balance_start - amount,
            "Amount wasn't correctly taken from the sender"
        );

        assert.equal(
            account1_balance_end,
            account1_balance_start + amount,
            "Amount wasn't correctly transfered to account[1]"
        );
    });

    it('should opposit the boolean transferState', async () => {
        const instance = await FST.deployed();

        const currentState = await instance.getTransferState.call();
        const newState = await instance.setTransferState.call({from: accounts[0]});

        assert.equal(
            currentState,
            !newState,
            "Transfer state hasn't been switched"
        )
    });

    it('should allow owner to make a transfer even if transferAllowed is false', async () => {
        const instance = await FST.deployed();
        let theError = null;
        try {
            await instance.transfer(accounts[1], 100, {from: accounts[0]});
        } catch (error) {
            theError = error;
        }

        assert.equal(
            theError,
            null,
            "The transfer has been blocked by _isTransferAllowed modifier"
        );
    });

    it('should not allow transfer for non owner user when transfer is disabled', async () => {
        const instance = await FST.deployed();
        let theError = null;
        try {
            await instance.transfer(accounts[2], 100, {from: accounts[1]});
        } catch (error) {
            theError = error;
        }

        assert.notEqual(
            theError,
            null,
            "The transfer hasn't been blocked by _isTransferAllowed modifier"
        );
    });

    it('should transfer 100 FST from account[1] to account[0] when transfer is ALLOWED', async () => {
        const instance = await FST.deployed();
        let theError = null;

        //set transferAllowed to true
        await instance.setTransferState(true, {from: accounts[0]});
        
        //load accounts[1] balance with 100 FST
        await instance.transfer(accounts[1], 100, {from: accounts[0]});

        //transfer 100 FST from accounts[1] to accounts[0]
        try {
            await instance.transfer(accounts[0], 100, {from: accounts[1]});
        } catch (error) {
            theError = error;
        }

        assert.equal(
            theError,
            null,
            "transfer has been blocked even if transfer is allowed"
        );
    });
    
    it('should NOT opposit the transferAllowed if sender is not the contract owner', async () => {
        const instance = await FST.deployed();
        let theError = null;

        try {
            await instance.setTransferState(true, {from: accounts[5]});
        } catch (error) {
            theError = error;
        }
        assert.notEqual(
            theError,
            null,
            "transfer state had been switched by a non owner user"
        );
    });
})