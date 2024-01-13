
'use client'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Input,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Divider,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';

import Image from 'next/image';

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

const CreateWallet = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amountToSend, setAmountToSend] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [isNewWallet, setIsNewWallet] = useState(true);
  const [ethBalance, setEthBalance] = useState(0);
  const [walletCreated, setWalletCreated] = useState(false);
  const [importedwallet, setImportedWallet] = useState('');

  const [transactions, setTransactions] = useState([]);

  const [notfound, setNotFound] = useState('');

  const [allTransactions, setAllTransactions] = useState([]);

  const [currentTab, setCurrentTab] = useState('sendMoney');

  const [selectedNetwork, setSelectedNetwork] = useState('https://polygon-mumbai.g.alchemy.com/v2/3topTnnh-PPSDB8zI4MCLJbCfG2Wkpx1'); // Default to Binance Smart Chain (BSC)

  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);

  const handleNetworkChange = (newNetwork) => {
    setSelectedNetwork(newNetwork);
    setShowNetworkDropdown(false);
  };

  const toggleNetworkDropdown = () => {
    setShowNetworkDropdown((prev) => !prev);
  };
 

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  useEffect(() => {
    if (privateKey && walletAddress) {
      fetchEthBalance();
      fetchAllTransactions();
    }
  }, [privateKey, walletAddress]);

  const fetchEthBalance = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(selectedNetwork);
      const balance = await provider.getBalance(walletAddress);
      setEthBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
    }
  };

  const createWallet = () => {
    const wallet = ethers.Wallet.createRandom();
    setPrivateKey(wallet.privateKey);
    setWalletAddress(wallet.address);
    setWalletCreated(true);
    fetchEthBalance();
  };

  const importWallet = (privateKey) => {
    setPrivateKey(privateKey);
    const wallet = new ethers.Wallet(privateKey);
    setWalletAddress(wallet.address);
    setWalletCreated(true);
    fetchEthBalance();
  };

  const logout = () => {
    setPrivateKey('');
    setWalletAddress('');
    setRecipientAddress('');
    setAmountToSend('');
    setTransactionHash('');
    setIsNewWallet(false);
    setEthBalance(0);
    setWalletCreated(false);
  };

  const sendFunds = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(selectedNetwork);
      const wallet = new ethers.Wallet(privateKey, provider);
      const tx = await wallet.sendTransaction({
        to: recipientAddress,
        value: ethers.parseEther(amountToSend),
      });
      setTransactionHash(tx.hash);
    } catch (error) {
      console.error('Error sending funds:', error);
    }
  };

  const fetchAllTransactions = async () => {
    try {
      const apiKey = 'XB61QPDHJQA19IXP8TEEUJ83YTS4NY5BRH'; // Replace with your Polygonscan API key
      const apiUrl = `https://api-testnet.polygonscan.com/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;
      
      const response = await axios.get(apiUrl);

      if (response.data.status === '1') {
        const transactions = response.data.result;
        setAllTransactions(transactions);
        // Process and store the transactions as needed
        console.log('All transactions:', transactions);
      } else {
        console.error('Error fetching transactions:', response.data.message);
        setNotFound(response.data.message)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const isWalletCreatedOrImported = privateKey !== '';

  return (
    <Box maxW="md" mx="auto" p="6" bg="black" rounded="md" shadow="md">
       <Select
       sx={{color:'white',width:'71%',borderRadius:'28px',display:'flex',margin:'auto',textAlign:'center',padding:'inherit',border:'2px solid white'}}
                value={selectedNetwork}
                onChange={(e) => handleNetworkChange(e.target.value)}
              >
                <option sx={{color:'white'}}  value="https://data-seed-prebsc-1-s1.binance.org:8545">Binance Smart Chain (BSC) </option>
                <option sx={{color:'white'}}  value="https://rpc.goerli.mudit.blog/">Goerli</option>
                <option sx={{color:'white'}}  value="https://polygon-mumbai.g.alchemy.com/v2/your-alchemy-key">Mumbai Testnet</option>
                {/* Add more networks as needed */}
              </Select>
              <br></br>
    <Text sx={{color:'white'}}  fontSize="3xl" fontWeight="semibold" mb="4" textAlign="center">
      WalletX
    </Text>
    {isWalletCreatedOrImported ? (
      <>
        <Box mb="4" maxW="full" overflowWrap="break-word">
       
          <Text sx={{color:'white', textAlign:'center',fontSize:'48px'}} >{ethBalance} ETH</Text>
          <Text sx={{color:'white',textAlign:'center',}}  >Wallet Address:</Text>
          <Text sx={{color:'white'}} >{walletAddress}</Text>
        </Box>
        <Tabs value={currentTab} onChange={handleTabChange} mb="4">
          <TabList>
            <Tab sx={{color:'white'}}  value="sendMoney">Send Money</Tab>
            <Tab sx={{color:'white'}}  value="viewTransactions">View All Transactions</Tab>
            <Tab sx={{color:'white'}}  value="emptyTab">Private Key</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <FormControl mb="2">
                <FormLabel sx={{color:'white'}}  >Recipient Address:</FormLabel>
                <Input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
              </FormControl>
              <FormControl mb="2">
                <FormLabel sx={{color:'white'}}  >Amount to Send (ETH):</FormLabel>
                <Input
                  type="text"
                  value={amountToSend}
                  onChange={(e) => setAmountToSend(e.target.value)}
                />
              </FormControl>
              <Button
                colorScheme="orange"
                onClick={sendFunds}
                mb="4"
                width="full"
                mx="auto"
                display="flex"
              >
                Send Funds
              </Button>
            </TabPanel>
            <TabPanel sx={{maxHeight:"34vh",overflowY:"auto"}}>
              
              {allTransactions.length > 0 ? (
    <Stack spacing={4} >
      {allTransactions.map((transaction) => (
        <Box key={transaction.hash} p={4} borderWidth="1px" borderRadius="md">
          <Text sx={{ color: 'white' }}  fontWeight="semibold" mb="2" fontSize="lg">
            Type: {transaction.from.toLowerCase() === walletAddress.toLowerCase() ? 'Sent' : 'Received'}
          </Text>
         
          <Text sx={{ color: 'white' }}  mb="2">Amount: {ethers.formatEther(transaction.value)} ETH</Text>
          <Text sx={{ color: 'white' }}  mb="2">From: {transaction.from}</Text>
          <Text sx={{ color: 'white' }}  mb="2">To: {transaction.to}</Text>
          <Text sx={{ color: 'white' }}  >Transaction Hash: {transaction.hash}</Text>
        </Box>
      ))}
    </Stack>
  ) : (
    <Text sx={{ color: 'white' }} >{notfound}</Text>
  )}
            </TabPanel>
            <TabPanel>
            
              <Text sx={{color:'white'}}  mb="1">Private Key:</Text>
             <Text sx={{color:'white'}} >{privateKey}</Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Button
          
          sx={{background:'white',color:'black'}}
          onClick={logout}
          mb="4"
          width="full"
        >
          Logout
        </Button>
      </>
    ) : (
      <>
      <Image style={{margin:"auto"}} src="/logo.png" width={300} height={300}  />
      <RadioGroup sx={{display:"grid",justifyContent:"center"}} mb="4" value={isNewWallet ? 'newWallet' : 'importWallet'} onChange={(value) => setIsNewWallet(value === 'newWallet')}>
  <FormControl display="flex" alignItems="center" mb="2">
    <Radio value="newWallet" colorScheme="blue" mr="2" size="lg" />
    <Text fontSize="lg" fontWeight="bold" color="white">Create New Wallet</Text>
  </FormControl>
  <FormControl display="flex" alignItems="center">
    <Radio value="importWallet" colorScheme="blue" mr="2" size="lg" />
    <Text fontSize="lg" fontWeight="bold" color="white">Import Existing Wallet</Text>
  </FormControl>
</RadioGroup>
        {isNewWallet ? (
          <Button
            colorScheme="orange"
            onClick={createWallet}
            mb="4"
            width="full"
          >
            Generate Wallet
          </Button>
        ) : (
          <FormControl mb="4">
            <FormLabel  sx={{color:'white'}} >Private Key:</FormLabel>
            <Input
              type="text"
              sx={{color:'white'}}
              value={importedwallet}
              onChange={(e) => setImportedWallet(e.target.value)}
            />
            <Button
              colorScheme="orange"
              mb="4"
              width="full"
              onClick={() => importWallet(importedwallet)}
              mt="2"
            >
              Import Wallet
            </Button>
          </FormControl>
        )}
      </>
    )}
  </Box>
);
};

export default CreateWallet;
