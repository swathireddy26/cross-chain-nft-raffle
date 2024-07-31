// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

contract NFTRaffle {
    address public owner;
    mapping(address => uint256) public entryCount;
    address[] public players;
    address[] private playerSelector;
    bool public raffleStatus;
    uint256 public entryCost;
    uint256 public totalEntries;

    event NewEntry(address player);
    event RaffleStarted();
    event RaffleEnded();
    event WinnerSelected(address winner);
    event EntryCostChanged(uint256 newCost);
    event BalanceWithdrawn(uint256 amount);

    constructor(uint256 _entryCost) {
        owner = msg.sender;
        entryCost = _entryCost;
        raffleStatus = false;
        totalEntries = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this contract");
        _;
    }

    function startRaffle() external onlyOwner {
        require(!raffleStatus, "Raffle is already started");
        raffleStatus = true;
        emit RaffleStarted();
    }

    function isPlayer(address _player) private view returns (bool) {
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == _player) {
                return true;
            }
        }
        return false;
    }

    function buyEntry(uint256 _numberOfEntries) public payable {
        require(raffleStatus, "Raffle has not started");
        require(
            msg.value == entryCost * _numberOfEntries,
            "Incorrect amount sent"
        );

        entryCount[msg.sender] += _numberOfEntries;
        totalEntries += _numberOfEntries;

        if (!isPlayer(msg.sender)) {
            players.push(msg.sender);
            emit NewEntry(msg.sender);
        }

        for (uint256 i = 0; i < _numberOfEntries; i++) {
            playerSelector.push(msg.sender);
        }
    }

    function endRaffle() external onlyOwner {
        require(raffleStatus, "Raffle is not started");
        raffleStatus = false;
        emit RaffleEnded();
    }

    function selectWinner() external returns (address) {
        require(!raffleStatus, "Raffle is still running");
        require(playerSelector.length > 0, "No Player in the raffle");

        uint256 winnerIndex = random() % playerSelector.length;
        address winner = playerSelector[winnerIndex];
        emit WinnerSelected(winner);

        resetEntryCount();
        delete players;
        delete playerSelector;
        totalEntries = 0;
        return winner;
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        block.timestamp,
                        players.length
                    )
                )
            );
    }

    function resetEntryCount() private {
        for (uint256 i = 0; i < players.length; i++) {
            entryCount[players[i]] = 0;
        }
    }

    function changeEntryCost(uint256 _newEntryCost) external onlyOwner {
        require(!raffleStatus, "Cant be changed when raffle is running");
        entryCost = _newEntryCost;
        emit EntryCostChanged(_newEntryCost);
    }

    function withdrawBalance() external onlyOwner {
        require(address(this).balance > 0, "No Balance to withdraw");

        payable(owner).transfer(address(this).balance);
        emit BalanceWithdrawn(address(this).balance);
    }

    function getPlayer() public view returns (address[] memory) {
        return players;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function resetContract() external onlyOwner {
        //in case something goes wrong
        delete playerSelector;
        delete players;
        raffleStatus = false;
        entryCost = 0;
        totalEntries = 0;
        resetEntryCount();
    }
}
