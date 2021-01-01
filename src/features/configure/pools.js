import BigNumber from "bignumber.js";
// id: '池子id',
// name: '池子名字',  
// token: '池子代币',
// tokenDescription: '代币描述',
// tokenAddress: '代币ERC20地址',
// tokenDecimals: '存入精度'
// itokenDecimals: '提取精度'
// depostLimit: '存入最大数量限制' 0时不限制
// depostAlert: '存入提示'
// earnedToken: '奖励代币',
// earnedTokenAddress: '奖励代币ERC20地址',
// earnContractAddress: '池子合约地址',
// price ： 挖的代币的价格！
// path price: 
export const pools = [
  {
    id: 'usdc',
    name: 'USDC',  
    token: 'USDC',
    tokenDescription: 'USDC',
    tokenAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',    
    tokenAddress: '',
    tokenDecimals: 18,
    itokenDecimals: 18,
    depostLimit:0,
    depostAlert:'',
    tokenDescriptionUrl: '',
    tokenDescriptionUrl2: '',
    earnedToken: 'iUSDC',
    earnedTokenAddress: '0xaeb98fd0ba5acdc9471ee868a6fdd85ba1f20c6a',
    earnContractAddress: '0xaeb98fd0ba5acdc9471ee868a6fdd85ba1f20c6a',
    defaultApy: "39.54",
    pricePerFullShare: 1,
    pastPricePerFullShare: 1
  },
  {
    id: 'dai',
    name: 'DAI',  
    token: 'DAI',
    tokenDescription: 'DAI',
    tokenAddress: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    tokenDecimals: 18,
    itokenDecimals: 18,
    depostLimit:0,
    depostAlert:'',
    tokenDescriptionUrl: '',
    tokenDescriptionUrl2: '',
    earnedToken: 'iDAI',
    earnedTokenAddress: '0xa38cAdD483c188F72a961b74482b14cfbc35a2CA',
    earnContractAddress: '0xa38cAdD483c188F72a961b74482b14cfbc35a2CA',
    defaultApy: "39.54",
    pricePerFullShare: 1,
    pastPricePerFullShare: 1
  },{
    id: 'busd',
    name: 'BUSD',  
    token: 'BUSD',
    tokenDescription: 'BUSD',
    tokenAddress: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    tokenDecimals: 18,
    itokenDecimals: 18,
    depostLimit:0,
    depostAlert:'',
    tokenDescriptionUrl: '',
    tokenDescriptionUrl2: '',
    earnedToken: 'iBUSD',
    earnedTokenAddress: '0xd2c17eBf8DEdB9bD9D32699820E5d254eccA86b7',
    earnContractAddress: '0xd2c17eBf8DEdB9bD9D32699820E5d254eccA86b7',
    defaultApy: "42.63",
    pricePerFullShare: 1,
    pastPricePerFullShare: 1
  },
]