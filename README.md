# French square assesment

## in order to run the dapp:

- git submodule init
- git submodule update
- cd french-square-test-tech/
- npm install
- npm start

this will start the UI at http://localhost:3000

Select and connect your account though Metamask to ropsten testnet

Make sure your account is stocked with some rETH (for ropsten) and then you can make a transfer (if it's allowed by the owner) to any ETH account on ropsten.

## in order to run tests on the contract

in the first terminal:

- cd to project root

in the second terminal:

- open a new terminal
- cd to project root
- run "truffle develop" cmd
  once in the develop console
  - run "compile"
  - then run "migrate"

get back to your first terminal:

- run truffle test
