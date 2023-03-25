import { ethers } from "hardhat";
import { expect } from "chai";

describe("EwwMarketplace", function () {
  let contract: any, deployer: any, sender: any, receiver;
  let packName = "My Pack";
  let packDescription = "This is my pack";
  let packImage = "https://my-pack-image.com";
  let owner = "0x1234567890123456789012345678901234567890";
  let price = ethers.utils.parseEther("1.0");
  let assets = "QmbFSBnoUKDvzLwzkrpFbbL8Gq1q48v3KSpQ2N9nu1J8Rc";
  let codes = "QmbFSBnoUKDvzLwzkrpFbbL8Gq1q48v3KSpQ2N9nu1J8Rc";

  before(async function () {
    const [deployerSigner, senderSigner, receiverSigner] = await ethers.getSigners();
    deployer = deployerSigner;
    sender = senderSigner;
    receiver = receiverSigner;

    const Token = await ethers.getContractFactory("EwwMarketplace");
    contract = await Token.deploy("EwwAsset", "EwwA");
    await contract.deployed();
  });

  describe("mint", function () {
    it("should allow anyone to mint a pack", async function () {
      await contract.connect(sender).mint(
        packName,
        packDescription,
        packImage,
        owner,
        price,
        assets,
        codes
      );
      expect(await contract.balanceOf(sender.address)).to.equal(1);
      expect(await contract.ownerOf(0)).to.equal(sender.address);
    });
  });

  describe("tokenURI", function () {
    it("should return the image of the pack as the token URI", async function () {
      let uri = await contract.tokenURI(0);
      expect(uri).to.equal(packImage);
    });
  });

  describe("deletePack", function () {
    it("should allow the contract owner to delete a pack", async function () {
      await contract.connect(deployer).deletePack(0);
      expect(await contract.balanceOf(sender.address)).to.equal(0);
    });

    it("should not allow anyone else to delete a pack", async function () {
      await contract.connect(sender).mint(
        packName,
        packDescription,
        packImage,
        owner,
        price,
        assets,
        codes
      );
      expect(await contract.balanceOf(sender.address)).to.equal(1);
      await expect(
        contract.connect(sender).deletePack(1)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("getAllPacks", function () {
    it("should return an array of all the packs in the contract", async function () {
      await contract.connect(sender).mint(
        packName,
        packDescription,
        packImage,
        owner,
        price,
        assets,
        codes
      );
      let packs = await contract.getAllPacks();
      expect(packs.length).to.equal(3);
      expect(packs[1].name).to.equal(packName);
    });
  });
});
