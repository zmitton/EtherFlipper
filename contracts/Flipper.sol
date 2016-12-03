pragma solidity ^0.4.4;
contract Flipper{
    uint    public buyIn;
    address public player0;
    address public player1;
    uint    public seedBlock;

    enum GameStates {open, offerMade, gameOn}
    GameStates public game;
    address owner;

    modifier onlyState(GameStates expected){if(expected == game){_;}else{throw;}}
    
    function Flipper(){ owner = msg.sender; }
    
    function createGame() payable onlyState(GameStates.open){
        player0 = msg.sender;
        buyIn = msg.value;
        game = GameStates.offerMade;
    }
    
    function joinGame() payable onlyState(GameStates.offerMade){
        if(msg.value != buyIn) throw;
        player1 = msg.sender;
        seedBlock = block.number + 2;
        game = GameStates.gameOn;
    }
    
    function settle() onlyState(GameStates.gameOn){
        if(block.number <= seedBlock) throw;
        if(block.number <= seedBlock + 256) {
            if(uint(block.blockhash(seedBlock))%2 == 0){
                if(!player0.send(buyIn*2)) throw;
            }else{
                if(!player1.send(buyIn*2)) throw;
            }
        }
        game = GameStates.open;
        delete buyIn;
        delete player0;
        delete player1;
        delete seedBlock;
    }

    function collectAbandonedFunds() onlyState(GameStates.open){
        if(!owner.send(this.balance)) throw;
    }
}
