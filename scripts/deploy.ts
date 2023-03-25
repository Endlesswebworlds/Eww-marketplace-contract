import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';

async function main(): Promise<void> {
  const EwwMarketplaceFactory: ContractFactory = await ethers.getContractFactory(
    'EwwMarketplace',
  );
  const EwwMarketplace: Contract = await EwwMarketplaceFactory.deploy();
  await EwwMarketplace.deployed();
  console.log('EwwMarketplace deployed to: ', EwwMarketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
