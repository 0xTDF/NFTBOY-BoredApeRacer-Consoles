const { version } = require("os");
var chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;
const truffleAssert = require('truffle-assertions');


const C = artifacts.require("./BARConsoles")

contract('BARConsoles', accounts => {

  const [deployer] = accounts;
  let c


  beforeEach(async () => {
    c = await C.new()
  })

  
  it('has default values', async () => {

    expect(await c.currentTokenId()).to.be.a.bignumber.equal(new BN(1))

    expect(await c.MAX_SUPPLY()).to.be.a.bignumber.equal(new BN(5)) // 2k in actual
    expect(await c.cost()).to.be.a.bignumber.equal(new BN(web3.utils.toWei('0.04', 'ether')))

    expect(await c.preSaleStatus()).to.equal(false)
    expect(await c.generalSaleStatus()).to.equal(false)
    expect(await c.claimStatus()).to.equal(false)

    expect(await c.name()).to.equal('BARConsolesTest')
    expect(await c.symbol()).to.equal('BARCT')
    expect(await c.baseTokenURI()).to.equal('test')

    expect(await c.totalSupply()).to.be.a.bignumber.equal(new BN(0))

  })

  it('can change sale status', async () => {

    // initial values
    expect(await c.preSaleStatus()).to.equal(false)
    expect(await c.generalSaleStatus()).to.equal(false)
    expect(await c.claimStatus()).to.equal(false)

    // set claims live
    await c.setClaimStatus(true)
    expect(await c.preSaleStatus()).to.equal(false)
    expect(await c.generalSaleStatus()).to.equal(false)
    expect(await c.claimStatus()).to.equal(true)

    // set pre sale live
    await c.setPreSaleStatus(true)
    expect(await c.preSaleStatus()).to.equal(true)
    expect(await c.generalSaleStatus()).to.equal(false)
    expect(await c.claimStatus()).to.equal(true)

    // only general live
    await c.switchPreToGeneral()
    expect(await c.preSaleStatus()).to.equal(false)
    expect(await c.generalSaleStatus()).to.equal(true)
    expect(await c.claimStatus()).to.equal(false)

    // everyhting not live
    await c.setGeneralSaleStatus(false)
    expect(await c.preSaleStatus()).to.equal(false)
    expect(await c.generalSaleStatus()).to.equal(false)
    expect(await c.claimStatus()).to.equal(false)

  })

  it('owner can set mint cost', async () => {

    expect(await c.cost()).to.be.a.bignumber.equal(new BN(web3.utils.toWei('0.04', 'ether')))
    await c.setCost(web3.utils.toWei('1', 'ether'))
    expect(await c.cost()).to.be.a.bignumber.equal(new BN(web3.utils.toWei('1', 'ether')))
    
  })

  it('can airdrop tokens', async () => {

    expect(await c.totalSupply()).to.be.a.bignumber.equal(new BN(0))

    await c.airDrop([accounts[4], accounts[5]])
    expect(await c.totalSupply()).to.be.a.bignumber.equal(new BN(2))
    expect(await c.balanceOf(accounts[4])).to.be.a.bignumber.equal(new BN(1))
    expect(await c.balanceOf(accounts[5])).to.be.a.bignumber.equal(new BN(1))
    
  })
  


  it('claimants can claim tokens', async () => {

    await truffleAssert.reverts(
      c.claim({ from: accounts[3] }),
      "Not on pre-approved claim list or have already claimed"
    );
    
    await c.claimAddresses([accounts[8], accounts[9]])

    await truffleAssert.reverts(
      c.claim({ from: accounts[8] }),
      "It's not time yet"
    );

    // sets claim status live
    await c.setClaimStatus(true)
    expect(await c.claimStatus()).to.equal(true)

    await c.claim({ from: accounts[8] })
    await c.claim({ from: accounts[9] })
    expect(await c.balanceOf(accounts[8])).to.be.a.bignumber.equal(new BN(1))
    expect(await c.balanceOf(accounts[9])).to.be.a.bignumber.equal(new BN(1))
    expect(await c.totalSupply()).to.be.a.bignumber.equal(new BN(2))
    
    // tries to mint more than max of 1 token
    await truffleAssert.reverts(
      c.claim({ from: accounts[8] }),
      "Not on pre-approved claim list or have already claimed"
    );
    
    expect(await c.totalSupply()).to.be.a.bignumber.equal(new BN(2))
    
  })

  
  
  
  it('Pre sale works, max of 2 per address, 3 pre sale mints max', async () => { // 250 pre sale mints in actual
    
    // pre sale not live 
    await truffleAssert.reverts(
      c.mint(1, { value: 0.04e18, from: accounts[8] }),
      "It's not time yet"
    );

    await c.setPreSaleStatus(true)
    expect(await c.preSaleStatus()).to.equal(true)

    // not on whitelist
    await truffleAssert.reverts(
      c.mint(1, { value: 0.04e18, from: accounts[8] }),
      "Not on whitelist or maximum of 2 mints per address allowed"
    );
    
    await c.whitelistAddresses([accounts[8], accounts[9]])

    // wrong amount of ether sent
    await truffleAssert.reverts(
      c.mint(1, { value: 0.03e18, from: accounts[8] }),
      "Incorrect funds supplied"
    );

    // tries to mint more than 2 at pre sale
    await truffleAssert.reverts(
      c.mint(3, { value: 0.12e18, from: accounts[8] }),
      "2 mint maximum"
    );

    await c.mint(1, { value: 0.04e18, from: accounts[8] })
    expect(await c.balanceOf(accounts[8])).to.be.a.bignumber.equal(new BN(1))
    expect(await c.totalSupply()).to.be.a.bignumber.equal(new BN(1))

    // tries to mint 2 after already minting 1
    await truffleAssert.reverts(
      c.mint(2, { value: 0.08e18, from: accounts[8] }),
      "Not on whitelist or maximum of 2 mints per address allowed"
    );

    await c.mint(1, { value: 0.04e18, from: accounts[8] })
    expect(await c.balanceOf(accounts[8])).to.be.a.bignumber.equal(new BN(2))
    expect(await c.totalSupply()).to.be.a.bignumber.equal(new BN(2))

    // tries to mint a 3rd token
    await truffleAssert.reverts(
      c.mint(1, { value: 0.04e18, from: accounts[8] }),
      "Not on whitelist or maximum of 2 mints per address allowed"
    );

    await c.mint(1, { value: 0.04e18, from: accounts[9] })
    expect(await c.balanceOf(accounts[9])).to.be.a.bignumber.equal(new BN(1))
    expect(await c.totalSupply()).to.be.a.bignumber.equal(new BN(3))

    // tries to mint when all pre sale tokens sold
    await truffleAssert.reverts(
      c.mint(1, { value: 0.04e18, from: accounts[9] }),
      "Minting that many would exceed pre sale minting allocation"
    );

    expect(await c.balanceOf(accounts[9])).to.be.a.bignumber.equal(new BN(1))
    expect(await c.totalSupply()).to.be.a.bignumber.equal(new BN(3))

  })

  


  it('can mint from general sale but no more than MAX_SUPPLY', async () => {

    expect(await c.totalSupply()).to.be.a.bignumber.equal(new BN(0))

    // tries to mint before general sale live
    await truffleAssert.reverts(
      c.mint(1, { value: 0.04e18, from: accounts[9] }),
      "It's not time yet"
    );

    await c.setGeneralSaleStatus(true)
    expect(await c.generalSaleStatus()).to.equal(true)

    // tries to mint more than 3 tokens
    await truffleAssert.reverts(
      c.mint(4, { value: 0.16e18, from: accounts[9] }),
      "Maximum of 3 mints allowed"
    );

    await c.mint(3, { value: 0.12e18, from: accounts[9] })

    // tries to mint tokens that would exceed MAX_SUPPLY
    await truffleAssert.reverts(
      c.mint(3, { value: 0.12e18, from: accounts[9] }),
      "All tokens have been minted"
    );

    await c.mint(2, { value: 0.08e18, from: accounts[9] })
    expect(await c.totalSupply()).to.be.a.bignumber.equal(new BN(5))
    
    
  })

  

  it('returns token URI but only for minted tokens', async () => {

    expect(await c.totalSupply()).to.be.a.bignumber.equal(new BN(0))

    await c.setGeneralSaleStatus(true)
    expect(await c.generalSaleStatus()).to.equal(true)

    // tries to read tokenURI for token yet to be minted
    await truffleAssert.reverts(
      c.tokenURI(1),
      "ERC721Metadata: URI query for nonexistent token"
    );
    
    await c.mint(1, { value: 0.04e18, from: accounts[9] })
    expect(await c.totalSupply()).to.be.a.bignumber.equal(new BN(1))
    expect(await c.tokenURI(1)).to.equal('test1')

    await c.mint(1, { value: 0.04e18, from: accounts[9] })
    expect(await c.totalSupply()).to.be.a.bignumber.equal(new BN(2))
    expect(await c.tokenURI(2)).to.equal('test2')
    
  })


  it('can set base URI', async () => {

    expect(await c.totalSupply()).to.be.a.bignumber.equal(new BN(0))
    await c.setGeneralSaleStatus(true)
    expect(await c.generalSaleStatus()).to.equal(true)

    await c.mint(1, { value: 0.04e18, from: accounts[9] })
    expect(await c.totalSupply()).to.be.a.bignumber.equal(new BN(1))
    expect(await c.tokenURI(1)).to.equal('test1')

    await c.setBaseUri('editedBaseURI')
    expect(await c.tokenURI(1)).to.equal('editedBaseURI1')

  })
  

})