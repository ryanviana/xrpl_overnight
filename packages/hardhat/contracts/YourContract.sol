// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import { FunctionsClient } from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import { ConfirmedOwner } from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import { FunctionsRequest } from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/resources/link-token-contracts/
 */

/**
 * @title SelicRateOracle
 * @notice This is an example contract to show how to make HTTP requests using Chainlink
 * @dev This contract uses hardcoded values and should not be used in production.
 */
contract SelicRateOracle is FunctionsClient, ConfirmedOwner {
	using FunctionsRequest for FunctionsRequest.Request;

	// State variables to store the last request ID, response, and error
	bytes32 public s_lastRequestId;
	bytes public s_lastResponse;
	bytes public s_lastError;

	// Custom error type
	error UnexpectedRequestID(bytes32 requestId);

	// Event to log responses
	event Response(
		bytes32 indexed requestId,
		string selicRate,
		bytes response,
		bytes err
	);

	// Router address - Hardcoded for Mumbai
	// Check to get the router address for your supported network https://docs.chain.link/chainlink-functions/supported-networks
	address router = 0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C;

	// JavaScript source code
	// Fetch selicRate name from bacen api.
	string source =
		"const ultimosDias = args[0];"
		"const apiResponse = await Functions.makeHttpRequest({"
		"url: https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/${ultimosDias}?formato=json,"
		"});"
		"const responseData = apiResponse.data;"
		"return Functions.encodeString(responseData[0].valor);";

	//Callback gas limit
	uint32 gasLimit = 300000;

	// donID - Hardcoded for Mumbai
	// Check to get the donID for your supported network https://docs.chain.link/chainlink-functions/supported-networks
	bytes32 donID =
		0x66756e2d657468657265756d2d6d61696e6e65742d3100000000000000000000;

	// State variable to store the returned selicRate information
	string public selicRate;

	/**
	 * @notice Initializes the contract with the Chainlink router address and sets the contract owner
	 */
	constructor() FunctionsClient(router) ConfirmedOwner(msg.sender) {}

	/**
	 * @notice Sends an HTTP request for selicRate information
	 * @param subscriptionId The ID for the Chainlink subscription
	 * @param args The arguments to pass to the HTTP request
	 * @return requestId The ID of the request
	 */
	function sendRequest(
		uint64 subscriptionId,
		string[] calldata args
	) external onlyOwner returns (bytes32 requestId) {
		FunctionsRequest.Request memory req;
		req.initializeRequestForInlineJavaScript(source); // Initialize the request with JS code
		if (args.length > 0) req.setArgs(args); // Set the arguments for the request

		// Send the request and store the request ID
		s_lastRequestId = _sendRequest(
			req.encodeCBOR(),
			subscriptionId,
			gasLimit,
			donID
		);

		return s_lastRequestId;
	}

	/**
	 * @notice Callback function for fulfilling a request
	 * @param requestId The ID of the request to fulfill
	 * @param response The HTTP response data
	 * @param err Any errors from the Functions request
	 */
	function fulfillRequest(
		bytes32 requestId,
		bytes memory response,
		bytes memory err
	) internal override {
		if (s_lastRequestId != requestId) {
			revert UnexpectedRequestID(requestId); // Check if request IDs match
		}
		// Update the contract's state variables with the response and any errors
		s_lastResponse = response;
		selicRate = string(response);
		s_lastError = err;

		// Emit an event to log the response
		emit Response(requestId, selicRate, s_lastResponse, s_lastError);
	}
}
