import axios from 'axios';
import React, { useState, createContext, useEffect, useContext } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from "@web3-react/core";
import {ethers} from 'ethers';

interface PriceProps {
  bnbToUSD: number;
  bcToUSD: number;
  updatePrice: (paymentType: string) => void;
}
const PriceContext = createContext<PriceProps>({} as PriceProps);

export const PriceProvider: React.FC = ({ children }) => {
  const { account, library, active, activate } = useWeb3React();
  const [bnbToUSD, setBbnPrice] = useState<number>(0);
  const [bcToUSD, setBcPrice] = useState<number>(0);
  const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]

  const updatePrice = async () => {
      const priceFeed = new Contract(
        '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
        aggregatorV3InterfaceABI,
        new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/66df3fe7c4034b398f305d85fcf8bd84'),
      );
      let curRate = await priceFeed.latestRoundData();
      curRate = curRate[1].toString();
      setBbnPrice(Number(curRate.toString())/(10 ** 8))
  };

  useEffect(() => {
    updatePrice();
  },[])

  return (
    <PriceContext.Provider
      value={{ bnbToUSD, bcToUSD, updatePrice }}
    >
      {children}
    </PriceContext.Provider>
  );
};

export const usePriceContext = () => useContext(PriceContext);
