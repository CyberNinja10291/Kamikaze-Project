const url =
  // "https://devnet.helius-rpc.com/?api-key=ee528ad2-b235-4251-9cc1-a1cf7ec3e06e";
  "https://mainnet.helius-rpc.com/?api-key=ee528ad2-b235-4251-9cc1-a1cf7ec3e06e";
// https://devnet.helius-rpc.com/?api-key=ee528ad2-b235-4251-9cc1-a1cf7ec3e06e

import axios from "axios";

export const getAsset = async (tokens: string[]) => {
  try {
    const response = await axios.post(
      url,
      {
        jsonrpc: "2.0",
        id: "my-id",
        method: "getAssetBatch",
        params: {
          ids: tokens,
          // displayOptions: {
          //   showFungible: true, //return details about a fungible token
          // },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Asset: ", response.data.result);
    return response.data.result;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getAssetsByAuthority = async (authority: string) => {
  try {
    const response = await axios.post(
      url,
      {
        jsonrpc: "2.0",
        id: "my-id",
        method: "getAssetsByAuthority",
        params: {
          authorityAddress: authority,
          page: 1, // Starts at 1
          limit: 1000,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Asset: ", response.data.result);
    return response.data.result;
  } catch (error) {
    console.error("Error:", error);
  }
};
