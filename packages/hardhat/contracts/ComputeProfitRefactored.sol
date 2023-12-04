// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

contract ComputeProfitRefactored is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    error UnexpectedRequestID(bytes32 requestId);

    event Response(bytes32 indexed requestId, uint256 profit, bytes response, bytes err);

    string source = 
        "const selicRates = JSON.parse(args[0]);"
        "const initialValue = args[1];"
        "let totalProfitPercentage = 1;"
        "selicRates.forEach((rate) => {"
            "const dailyRate = 1 + parseFloat(rate) * 0.01;"
            "totalProfitPercentage *= parseFloat(dailyRate);"
        "});"
        "const profitReais = initialValue * (totalProfitPercentage - 1);"
        "const returnValue = Math.round(profitReais * Math.pow(10, 18));"
        "return Functions.encodeUint256(Number.parseInt(returnValue));";

    uint256 public profit;

    // Callback function signature
    bytes4 private constant CALLBACK_FUNCTION_SIGNATURE = bytes4(keccak256("callbackFunction(uint256)"));
    // Mapping to store callback addresses for each requestId
    mapping(bytes32 => address) private _callbackAddresses;

    constructor(address router) FunctionsClient(router) ConfirmedOwner(msg.sender) {}

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }
        s_lastResponse = response;

        // Check if response is not empty before decoding
        profit = abi.decode(response, (uint256));
        s_lastError = err;
        emit Response(requestId, profit, s_lastResponse, s_lastError);

        // Callback to the designated contract
        address callbackAddress = _callbackAddresses[requestId];
        require(callbackAddress != address(0), "Callback address not set");
        (bool success, ) = callbackAddress.call(abi.encodeWithSelector(CALLBACK_FUNCTION_SIGNATURE, profit));
        require(success, "Callback call failed");
    }

    function calculateProfit(
        address callbackAddress,
        bytes memory encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string[] memory args,
        bytes[] memory bytesArgs,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    ) external {
        bytes32 requestId = sendRequest(encryptedSecretsUrls, donHostedSecretsSlotID, donHostedSecretsVersion, args, bytesArgs, subscriptionId, gasLimit, donID);
        _callbackAddresses[requestId] = callbackAddress;
    }

    function sendRequest(
        bytes memory encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string[] memory args,
        bytes[] memory bytesArgs,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    ) internal returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        if (encryptedSecretsUrls.length > 0)
            req.addSecretsReference(encryptedSecretsUrls);
        else if (donHostedSecretsVersion > 0) {
            req.addDONHostedSecrets(
                donHostedSecretsSlotID,
                donHostedSecretsVersion
            );
        }
        if (args.length > 0) req.setArgs(args);
        if (bytesArgs.length > 0) req.setBytesArgs(bytesArgs);
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        return s_lastRequestId;
}

}