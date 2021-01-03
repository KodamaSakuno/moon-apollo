Welcome to YFII Project Apollo

## Pain Points of Existing DeFi Yield Aggregators
An new wave of DeFi mining era is coming as the booming of Algorithmic Stablecoins, however, currently these new projects are not general investors friendly. The reasons are:

- First, high yields APY usually come with high gas fees, the result is half a day of your income probably will go for Ethereum miners.
- DeFi is growing fast. It takes a lot of effort and time to research and learn new products and concepts even for experienced investors.
- Higher APY might also means shorter mining window. And as the amount of your capital staked is too low. Other investors start to claim their income before you do which means you probably miss the best harvest time for selling your yammy yeild.

## Principle of Design

To address these pain points, here we design an new generation of aggregators contracts, under code name, YFII Project Apollo. Basically, YFII Apollo is a minimalist aggregator product which focuss on gas-optimization, quick strategy switching, and DeFi composability. Some principle of design are as follows:

- Minimize chain calculations and save user fees. Contract earnings take manual claim model, no longer included in compound interest. The contract only records each users current balance, as a deposit and income receipt certificate, not tokenization. It is estimated that at 140 gas, the average operation per deposit and withdrawal will be reduced from $60 to about $7.
- The trading path of farming income is designed as a pluggable mode, reserving interfaces to find the best trading path, and allowing community traders to manually trade in semi-automatic mode, Traders manually convert returns to YFII and return them to the vaults to allow immediate adjustments to be made when a new mine is created and the chain trades are illiquid.
- Handling fees in order to enter and leave the mine pool is executed uniformly by the official YFII robot, which is triggered only when saving exceed a certain threshold. Fees are deducted from the mining profits to further reduce the fees for ordinary retail investors.


## How to run locally
> yarn
yarn start

