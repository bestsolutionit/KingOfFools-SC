// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface ERC20Token {
    function transfer(address dst, uint wad) external returns (bool);
    function transferFrom(address src, address dst, uint wad) external returns (bool);
    function balanceOf(address guy) external view returns (uint);
}

contract KingOfTheFools is Ownable {
  using SafeMath for uint;
  AggregatorV3Interface internal priceFeed;
  ERC20Token public usdcToken;

  struct TypeDepositInfo{        
    uint currency; // 0: ETH,  1: USDC
    uint256 amount;
    address sender;
  }
  TypeDepositInfo private previousDeposit;

  event Deposit(address indexed _from, uint _currency, uint _value);

  constructor(address _usdcAddress, address _priceFeed) {
    usdcToken = ERC20Token(_usdcAddress);       
    priceFeed = AggregatorV3Interface(_priceFeed); 
  }

  function getLatestPrice() internal view returns (int) {
      (
          uint80 roundID, 
          int price,
          uint startedAt,
          uint timeStamp,
          uint80 answeredInRound
      ) = priceFeed.latestRoundData();
      return price;      
  }

  function processKingOfTheFool(uint _currency, uint256 _amount) internal {
    if (previousDeposit.amount > 0){
      if (previousDeposit.currency != _currency){
        int price = getLatestPrice();
        uint256 converted_amount = previousDeposit.amount.mul(1e12).div(uint(price));
        if (_currency == 1){
          converted_amount = previousDeposit.amount.mul(uint(price)).div(1e12);
          if (converted_amount.mul(3).div(2) <= _amount){
            usdcToken.transferFrom(address(this), previousDeposit.sender, _amount);     
          }
        } else {
          if (converted_amount.mul(3).div(2) <= _amount){
            payable(previousDeposit.sender).transfer(_amount);
          }
        }        
      } else {
         if (_currency == 1){
            if (previousDeposit.amount.mul(3).div(2) <= _amount){
              usdcToken.transfer(previousDeposit.sender, _amount);     
            }             
         } else {
            if (previousDeposit.amount.mul(3).div(2) <= _amount){
              payable(previousDeposit.sender).transfer(_amount);    
            }  
         }
      }
    }
  }

  function depositEth() public payable {
    processKingOfTheFool(0, msg.value);
    previousDeposit = TypeDepositInfo({currency:0, amount:msg.value, sender: msg.sender});    
    emit Deposit(msg.sender, 0, msg.value);
  }

  function depositUSDC(uint256 _amount) public {
    require(_amount > 0, "USDC amount should be > 0");    
    usdcToken.transferFrom(msg.sender, address(this), _amount);  
    processKingOfTheFool(1, _amount);
    previousDeposit = TypeDepositInfo(1, _amount, msg.sender);
    emit Deposit(msg.sender, 1, _amount);
  }

  function getContractBal() public view returns (uint){
    return address(this).balance;
  }
}
