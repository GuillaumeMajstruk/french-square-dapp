// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./IERC20.sol";

contract FST is IERC20 {
    event TransferState(bool newState);

    uint256 private constant MAX_UINT256 = 2**256 - 1;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowed;
    uint256 public totalSupply;

    bool private transferAllowed;
    address public owner;

    string public name; //fancy name: eg Simon Bucks
    uint8 public decimals; //How many decimals to show.
    string public symbol; //An identifier: eg SBX

    constructor(
        uint256 _initialAmount,
        string memory _tokenName,
        uint8 _decimalUnits,
        string memory _tokenSymbol
    ) {
        balances[msg.sender] = _initialAmount; // Give the creator all initial tokens
        totalSupply = _initialAmount; // Update total supply
        name = _tokenName; // Set the name for display purposes
        decimals = _decimalUnits; // Amount of decimals for display purposes
        symbol = _tokenSymbol; // Set the symbol for display purposes
        owner = msg.sender;
        transferAllowed = false;
    }

    modifier _ownerOnly() {
        require(
            msg.sender == owner,
            "only the owner can trigger this action !"
        );
        _;
    }

    modifier _isTransferAllowed() {
        require(
            (transferAllowed == true && msg.sender != owner) ||
                msg.sender == owner,
            "transfer is not allowed !"
        );
        _;
    }

    function getTransferState() public view override returns (bool) {
        return transferAllowed;
    }

    function setTransferState(bool newState) public _ownerOnly returns (bool) {
        transferAllowed = newState;
        emit TransferState(newState);
        return newState;
    }

    function transfer(address _to, uint256 _value)
        public
        override
        _isTransferAllowed
        returns (bool success)
    {
        require(
            balances[msg.sender] >= _value,
            "token balance is lower than the value requested"
        );
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public override _isTransferAllowed returns (bool) {
        require(_value <= balances[_from], "supplier balance is not enought !");
        require(_value <= allowed[_from][msg.sender], "is not allowed !");

        balances[_from] -= _value;
        allowed[_from][msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function balanceOf(address _owner)
        public
        view
        override
        returns (uint256 balance)
    {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value)
        public
        override
        returns (bool success)
    {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function allowance(address _owner, address _spender)
        public
        view
        override
        returns (uint256 remaining)
    {
        return allowed[_owner][_spender];
    }
}
