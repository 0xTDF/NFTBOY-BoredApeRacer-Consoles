// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;



// IMPORTS //


/**
 * @dev ERC721 token standard
 */
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/**
 * @dev Modifier 'onlyOwner' becomes available, where owner is the contract deployer
 */
import "@openzeppelin/contracts/access/Ownable.sol";



// CONTRACT //

contract BARConsoles is ERC721Enumerable, Ownable { 
    
    
    uint256 private currentTokenId = 1;

    uint256 public MAX_SUPPLY = 2000; 
    uint256 public cost = 40000000000000000; // cost of minting in Wei, equivalent to 0.04 ether
    
    uint256 private preSaleMintsTotal;
    string private baseTokenURI;
    
    bool public preSaleStatus = false;
    bool public generalSaleStatus = false;
    bool public claimStatus = false;
    

    constructor(
        string memory _name,
        string memory _symbol,  
        string memory _uri
        
    ) ERC721(_name, _symbol) {
        baseTokenURI = _uri;
    }
    
    
    // EVENTS //
    
    event TokenBought(uint256 tokenId);
    
    
    // MAPPINGS //
    
    mapping(address => uint) whitelist;
    mapping(address => bool) claimList;


        
    // PUBLIC //
    
    
    /**
     * @dev Mint a token through pre or general sale
     * @param _num - number of tokens to mint
     */
    function mint(uint256 _num) external payable {
        
        require(msg.value == _num * cost, "Incorrect funds supplied"); // mint cost
        
        if (preSaleStatus == true) {
            require(_num > 0 && _num <=2, "2 mint maximum");
            require(whitelist[msg.sender] >= _num, "Not on whitelist or maximum of 2 mints per address allowed"); // checks if white listed & mint limit per address is obeyed
            require(preSaleMintsTotal + _num <= 250, "Minting that many would exceed pre sale minting allocation"); // ensures pre sale total mint limit is obeyed
            whitelist[msg.sender] -= _num; // reduces caller's minting allownace by the number of tokens they minted
            preSaleMintsTotal += _num; 
        } else {
            require(generalSaleStatus, "It's not time yet"); // checks general sale is live
            require(_num > 0 && _num <= 3, "Maximum of 3 mints allowed"); // mint limit per tx
        }
        
        for (uint256 i = 0; i < _num; i++) {
            uint tokenId = currentTokenId;
            require(tokenId <= MAX_SUPPLY, "All tokens have been minted");
            currentTokenId++;
            _mint(msg.sender, tokenId);
            emit TokenBought(tokenId);
            
        }
    }
    
    
    /**
     * @dev Mint token if on pre approved 'claimList'
     */
    function claim() external {
        
        require(claimStatus, "It's not time yet"); // ensures claiming is live
        require(claimList[msg.sender], "Not on pre-approved claim list or have already claimed");
        
        uint tokenId = currentTokenId;
        require(tokenId <= MAX_SUPPLY, "All tokens have been minted");
        currentTokenId++;

        claimList[msg.sender] = false; // ensures they cannot claim a token a second time
        _mint(msg.sender, tokenId);
        emit TokenBought(tokenId);
    }
    
    
    
    // VIEW //
    
    
    /**
     * @dev Returns tokenURI, which is comprised of the baseURI concatenated with the tokenId
     */
    function tokenURI(uint256 _tokenId) public view override returns(string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(baseTokenURI, Strings.toString(_tokenId)));
    }
    
    
    

    // ONLY OWNER //
    
    
    /**
     * @dev Withdraw ether from smart contract. Only contract owner can call.
     * @param _to - address ether will be sent to
     * @param _amount - amount of ether, in Wei, to be withdrawn (1 wei = 1e-18 ether)
     */
    function withdrawFunds(address payable _to, uint _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Withdrawal amount greater than balance");
        _to.transfer(_amount);
    }
    
    
    /**
     * @dev Withdraw all ether from smart contract. Only contract owner can call.
     * @param _to - address ether will be sent to
     */
    function withdrawAllFunds(address payable _to) external onlyOwner {
        require(address(this).balance > 0, "No funds to withdraw");
        _to.transfer(address(this).balance);
    }
    
    
    /**
     * @dev Add addresses to white list, giving access to mint 2 tokens at pre sale
     * @param _addresses - array of address' to add to white list mapping
     */
    function whitelistAddresses(address[] calldata _addresses) external onlyOwner {
        for (uint i=0; i<_addresses.length; i++) {
            whitelist[_addresses[i]] = 2;
        }
    }
    
    
    /**
     * @dev Add addresses to claim list, giving access to claim function
     * @param _addresses - array of address' to add to claim list mapping
     */
    function claimAddresses(address[] calldata _addresses) external onlyOwner {
        for (uint i=0; i<_addresses.length; i++) {
            claimList[_addresses[i]] = true;
        }
    }
    
    
    /**
     * @dev Airdrop 1 token to each address in array '_to'
     * @param _to - array of address' that tokens will be sent to
     */
    function airDrop(address[] calldata _to) external onlyOwner {
        for (uint i=0; i<_to.length; i++) {
            uint tokenId = currentTokenId;
            require(tokenId <= MAX_SUPPLY, "All tokens have been minted");
            currentTokenId++;
            _mint(_to[i], tokenId);
            emit TokenBought(tokenId);
        }
        
    }


    /**
     * @dev Set the baseURI string
     */
    function setBaseUri(string memory _newBaseUri) external onlyOwner {
        baseTokenURI = _newBaseUri;
    }
    
    
    /**
     * @dev Set the cost of minting a token
     * @param _newCost in Wei. Where 1 Wei = 10^-18 ether
     */
    function setCost(uint _newCost) external onlyOwner {
        cost = _newCost;
    }
    
    
    /**
     * @dev Set the status of the pre sale
     * @param _status boolean where true = live 
     */
    function setPreSaleStatus(bool _status) external onlyOwner {
        preSaleStatus = _status;
    }
    
    
    /**
     * @dev Set the status of the general sale
     * @param _status boolean where true = live 
     */
    function setGeneralSaleStatus(bool _status) external onlyOwner {
        generalSaleStatus = _status;
    }


    /**
     * @dev Set the status of claim minitng
     * @param _status boolean where true = live 
     */
    function setClaimStatus(bool _status) external onlyOwner {
        claimStatus = _status;
    }
    
    
    /**
     * @dev Change the pre sale and claim status to over (false), and general sale status to live (true)
     */
    function switchPreToGeneral() external onlyOwner {
        claimStatus = false;
        preSaleStatus = false;
        generalSaleStatus = true;
    }
    
    
}