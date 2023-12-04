// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import "./IComputeProfit.sol"; // Ensure this interface matches the ComputeProfit contract

contract SelicOracle is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    IComputeProfit private computeProfitContract;
    uint256 public evmProfit;
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    error UnexpectedRequestID(bytes32 requestId);

    event Response(
        bytes32 indexed requestId,
        string character,
        bytes response,
        bytes err
    );

    address router = 0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C;

    string source =
        "const initialDate = args[0];"
        "const finalDate = args[1];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "  url: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados?formato=json&dataInicial=' + initialDate + '&dataFinal=' + finalDate"
        "});"
        "if (apiResponse.error) {"
        "  console.error(apiResponse.error);"
        "  throw Error();"
        "}"
        "const { data } = apiResponse;"
        "const valores = data.map(item => item.valor);"
        "return Functions.encodeString(JSON.stringify(valores));";

    uint32 gasLimit = 300000;

    bytes32 donID =
        0x66756e2d706f6c79676f6e2d6d756d6261692d31000000000000000000000000;

    string public character;

    constructor(address _computeProfitAddress) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        computeProfitContract = IComputeProfit(_computeProfitAddress);
    }

    function sendRequest(
        uint64 subscriptionId,
        string[] calldata args
    ) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        if (args.length > 0) req.setArgs(args);

        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        return s_lastRequestId;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }

        s_lastResponse = response;
        character = string(response);
        s_lastError = err;

        emit Response(requestId, character, s_lastResponse, s_lastError);
    }

    function computeProfit(
        bytes memory encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        bytes[] memory bytesArgs,
        uint64 subscriptionId
    ) external onlyOwner {
        // Prepare the arguments array
        string[] memory args = new string[](2);
        args[0] = character;  // Use the character string from Chainlink response
        args[1] = "100";     // Second argument is the fixed value "25000"

        // Call the calculateProfit function in ComputeProfit contract
        computeProfitContract.calculateProfit(
            encryptedSecretsUrls,
            donHostedSecretsSlotID,
            donHostedSecretsVersion,
            args,
            bytesArgs,
            subscriptionId,
            gasLimit,
            donID
        );
    }

    function retrieveProfit() external onlyOwner {
        evmProfit = computeProfitContract.getProfit();
}

}