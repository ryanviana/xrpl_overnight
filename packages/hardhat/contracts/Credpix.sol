//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ITPFt {
    function balanceOf(address) external returns (uint);

    function name() external returns (string memory);

    function symbol() external returns (string memory);

    function decimals() external returns (uint);

    function totalSupply() external returns (uint);
    
    function privilegedTransfer(address, address, uint) external returns (bool);

    function getTokenPrice() external returns (uint256);
}

interface IBRLt {
    function balanceOf(address) external returns (uint);

    function name() external returns (string memory);

    function symbol() external returns (string memory);

    function decimals() external returns (uint);

    function totalSupply() external returns (uint);
    
    function privilegedTransfer(address, address, uint) external returns (bool);
}

contract Credpix is Ownable{

    address public BRLtAddress;
    mapping(address => bool) public privilegedAccounts; //Servicos gov e bancos;

    constructor(address _BRLtAddress) Ownable(msg.sender) {
        BRLtAddress = _BRLtAddress;
        privilegedAccounts[msg.sender] = true;
        privilegedAccounts[address(this)] = true;
    }

    modifier onlyPrivileged() {
        require(privilegedAccounts[msg.sender], "Acesso negado: conta nao privilegiada");
        _;
    }

    function addPrivilegedAccount(address account) public onlyOwner {
        privilegedAccounts[account] = true;
    }

    function removePrivilegedAccount(address account) public onlyOwner {
        privilegedAccounts[account] = false;
    }

  function creditOperation(address _investor, address _TPFtAddress, uint256 _BRLAmount) public onlyPrivileged returns (bool){
    uint256 TFPtAmount = (_BRLAmount * 10 ** 18)/(ITPFt(_TPFtAddress).getTokenPrice());
    privilegedTransferTPFt(_TPFtAddress, _investor, address(this), TFPtAmount);
    privilegedTransferReal(msg.sender, _investor, _BRLAmount);

    return true;
    }

  function privilegedTransferReal(address _from, address _to, uint256 _amount) public onlyPrivileged {
    IBRLt(BRLtAddress).privilegedTransfer(_from, _to, _amount);
  }

  function privilegedTransferTPFt(address _TPFtAddress, address _from, address _to, uint256 _amount) public onlyPrivileged {
    ITPFt(_TPFtAddress).privilegedTransfer(_from, _to, _amount);
  }
}