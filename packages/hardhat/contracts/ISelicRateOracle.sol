//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ISelicRateOracle {
    struct Rate {
        uint256 integerPart;
        uint256 decimalPart;
    }

    function getRate() external view returns (Rate memory);
}