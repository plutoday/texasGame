//0 for holes decision
//1 for flops decision
//2 for turn decision
//3 for river decision
var stage = 0;

var aimoney = 1000;
var playermoney = 1000;
var onstagemoney = 0;

init();

function init() {
    setHidden();
    reloadMoney();
    setCardImages();
}

function setHidden() {
    document.getElementById('newgamebtn').hidden = false;
    document.getElementById('betbtn').hidden = true;
    document.getElementById('foldbtn').hidden = true;
    document.getElementById('playerresult').hidden = true;
    document.getElementById('airesult').hidden = true;
    document.getElementById('confirmbtn').hidden = true;
}

function reloadMoney(){
    document.getElementById('aimoney').textContent = aimoney;
    document.getElementById('playermoney').textContent = playermoney;
    document.getElementById('onstagemoney').textContent = onstagemoney;
}

function setCardImages() {
    document.getElementById('playerhole1').src="images/cards/folded.png";
    document.getElementById('playerhole2').src="images/cards/folded.png";
    document.getElementById('aihole1').src="images/cards/folded.png";
    document.getElementById('aihole2').src="images/cards/folded.png";
    document.getElementById('flop1').src="images/cards/folded.png";
    document.getElementById('flop2').src="images/cards/folded.png";
    document.getElementById('flop3').src="images/cards/folded.png";
    document.getElementById('turn').src="images/cards/folded.png";
    document.getElementById('river').src="images/cards/folded.png";
}

function newGameBtnClicked(id){
    document.getElementById(id).hidden = true;
    document.getElementById('betbtn').hidden = false;
    document.getElementById('foldbtn').hidden = false;
    //{"Hole1":{"Suit":2,"Rank":6},"Hole2":{"Suit":3,"Rank":3},"GameId":"13aa23ee-6789-4c9d-8f45-591b1e66270d"}
    var response = JSON.parse(newGame());
    var playerhole1ImgFile = getImageFileName(response.Hole1.Suit, response.Hole1.Rank);
    var playerhole2ImgFile = getImageFileName(response.Hole2.Suit, response.Hole2.Rank);
    document.getElementById('playerhole1').src = playerhole1ImgFile;
    document.getElementById('playerhole2').src = playerhole2ImgFile;
}

function betBtnClicked(id) {
    var response = JSON.parse(bet(stage));
    //{"Flop1":{"Suit":1,"Rank":3},"Flop2":{"Suit":4,"Rank":9},"Flop3":{"Suit":2,"Rank":12},
    //"AIDecision":0,"Result":null}
    if (response.AIDecision == 0) {
        switch (stage) {
            case 0:
            var flop1ImgFile = getImageFileName(response.Flop1.Suit, response.Flop1.Rank);
            var flop2ImgFile = getImageFileName(response.Flop2.Suit, response.Flop2.Rank);
            var flop3ImgFile = getImageFileName(response.Flop3.Suit, response.Flop3.Rank);
            document.getElementById('flop1').src = flop1ImgFile;
            document.getElementById('flop2').src = flop2ImgFile;
            document.getElementById('flop3').src = flop3ImgFile;
            stage++;
            break;
            case 1:
            var turnImgFile = getImageFileName(response.NextCard.Suit, response.NextCard.Rank);
            document.getElementById('turn').src = turnImgFile;
            stage++;
            break;
            case 2:
            var riverImgFile = getImageFileName(response.NextCard.Suit, response.NextCard.Rank);
            document.getElementById('river').src = riverImgFile;
            stage++;
            break;
            case 3:
            var aiHole1File = getImageFileName(response.AIHole1.Suit, response.AIHole1.Rank);
            var aiHole2File = getImageFileName(response.AIHole2.Suit, response.AIHole2.Rank);
            document.getElementById('aihole1').src = aiHole1File;
            document.getElementById('aihole2').src = aiHole2File;
            endGame(response.Result);
            break;
        }
        reloadMoney();
    } else {        
        endGame(response.Result);
    }
}

function foldBtnClicked(id) {
    var response = JSON.parse(fold(stage));
    endGame(response.Result);
}

function endGame(result) {
    if (result.PlayerWin) {
        playermoney += onstagemoney;
    } else {
        aimoney += onstagemoney;
    }
    onstagemoney = 0;

    document.getElementById('betbtn').hidden = true;
    document.getElementById('foldbtn').hidden = true;

    if (result.PlayerWin) {
        var playerResult = document.getElementById('playerresult');
        playerResult.textContent = result.Explanation;
        playerResult.hidden = false;
    } else {
        var aiResult = document.getElementById('airesult');
        aiResult.textContent = result.Explanation;
        aiResult.hidden = false;
    }
    document.getElementById('confirmbtn').hidden = false;
    reloadMoney();
}

function confirmBtnClicked(id) {
    setHidden();
    setCardImages();
    stage = 0;
}

function getImageFileName(originalSuit, originalRank) {
    var suit = translateSuit(originalSuit);
    var rank = translateRank(originalRank);
    return "images/cards/" + rank + "_of_" + suit + ".png";
}

function translateSuit(suit) {
    switch (suit) {
        case 1:
        return "diamonds";
        case 2:
        return "clubs";
        case 3:
        return "hearts";
        case 4:
        return "spades";
    }
}

function translateRank(rank) {
    if (rank <= 10) {
        return rank;
    }
    switch (rank) {
        case 11:
        return "jack";
        case 12:
        return "queen";
        case 13:
        return "king";
        case 14:
        return "ace";
    }
}