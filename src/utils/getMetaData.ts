const url =
  "https://mainnet.helius-rpc.com/?api-key=ee528ad2-b235-4251-9cc1-a1cf7ec3e06e";
// ("https://devnet.helius-rpc.com/?api-key=ee528ad2-b235-4251-9cc1-a1cf7ec3e06e");

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
    return response.data.result;
  } catch (error) {
    console.error("Error:", error);
    return [];
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
    return response.data.result;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getTokenPrice = async (tokenAddress: string) => {
  try {
    const coinGeckoURl =
      "https://api.coingecko.com/api/v3/simple/token_price/solana";
    const options = {
      headers: {
        accept: "application/json",
        "x-cg-pro-api-key": "CG-eCAQiyyomNgmoyAjby2dsuem",
      },
      params: {
        contract_addresses: tokenAddress,
        vs_currencies: "usd",
      },
    };
    const response = await axios.get(coinGeckoURl, options);
    if (Object.keys(response.data).length == 0) return 0;
    else return response.data[tokenAddress].usd;
  } catch (error) {
    console.error("Error:", error);
    return 0;
  }
};
