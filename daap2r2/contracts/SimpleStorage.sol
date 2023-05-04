// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Funder{
  mapping(address=>uint) private funders;
  receive() external payable{
    
  }
  function transfer()external payable{
    funders[msg.sender]+=msg.value;
  }
  function withdraw(uint withdra)external{
    require(withdra<=funders[msg.sender]);
    funders[msg.sender]-=withdra;
    payable(msg.sender).transfer(withdra);
  }
}