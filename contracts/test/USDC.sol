// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract USDC is ERC20, ERC20Burnable {
    constructor() ERC20("TestUSDC", "USDC") {
        _mint(msg.sender, 1000000 * 10**6 );
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    function mint() public {
        _mint(msg.sender, 1000000 * 10**6 );
    }
}