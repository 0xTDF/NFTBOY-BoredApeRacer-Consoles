addresses = [
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", 
    "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c", 
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", 
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB", 
    "0x617F2E2fD72FD9D5503197092aC168c91465E7f2", 
    "0x17F6AD8Ef982297579C203069C1DbfFE4348c372", 
    "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C", 
    "0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678", 
    "0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7", 
    "0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7",
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", 
    "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c", 
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", 
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB", 
    "0x617F2E2fD72FD9D5503197092aC168c91465E7f2", 
    "0x17F6AD8Ef982297579C203069C1DbfFE4348c372", 
    "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C", 
    "0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678", 
    "0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7", 
    "0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7",
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", 
    "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c", 
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", 
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB", 
    "0x617F2E2fD72FD9D5503197092aC168c91465E7f2", 
    "0x17F6AD8Ef982297579C203069C1DbfFE4348c372", 
    "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C", 
    "0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678", 
    "0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7", 
    "0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7",
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", 
    "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c", 
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", 
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB", 
    "0x617F2E2fD72FD9D5503197092aC168c91465E7f2", 
    "0x17F6AD8Ef982297579C203069C1DbfFE4348c372", 
    "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C", 
    "0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678", 
    "0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7", 
    "0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7",
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", 
    "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c", 
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", 
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB", 
    "0x617F2E2fD72FD9D5503197092aC168c91465E7f2", 
    "0x17F6AD8Ef982297579C203069C1DbfFE4348c372", 
    "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C", 
    "0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678", 
    "0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7", 
    "0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7"
]

// 733261 gas for 5 addresses
// 1433491 gas for 10 addresses
// 6999331 gas for 50 addresses

totalGas = (550/50)*6999331

gweiToEth = 0.000000001
gasPrice = 49 // gwei
ethPrice = 3806 // USD

totalUSD = totalGas * gweiToEth * gasPrice * ethPrice
console.log(totalUSD)
USDsaved = (20000*550) * gweiToEth * gasPrice * ethPrice
console.log(USDsaved)
