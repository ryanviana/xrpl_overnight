// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IComputeProfit {
    // Function signature for calculateProfit in the ComputeProfit contract
    function calculateProfit(
        bytes memory encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string[] memory args,
        bytes[] memory bytesArgs,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    ) external;

    // Function to retrieve the calculated profit from ComputeProfit contract
    function profit() external view returns(uint256);
}