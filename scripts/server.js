var url = "http://pokerserver-xiaoxuanli.azurewebsites.net/api/";
var gameId;

function newGame() {
    console.log("newGame called");
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url + "NewGame", false ); // false for synchronous request
    xmlHttp.send( null );
    gameId = JSON.parse(xmlHttp.responseText).GameId;
    return xmlHttp.responseText;
}

function bet(stage) {
    var bet = getPlayerBet(stage);
    playermoney -= bet;
    onstagemoney += bet;
    var request = {GameId: gameId, PlayerBet: bet, PlayerFold: false}
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", url + getApi(stage), false);
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send( JSON.stringify(request) );
    var aiDecision = JSON.parse(xmlHttp.responseText).AIDecision;
    if (aiDecision == 0) {
        aimoney -= bet;
        onstagemoney += bet;
    }
    stage++;
    return xmlHttp.responseText;
}

function getPlayerBet(stage) {
    switch(stage) {
        case 0:
        return 5;
        case 1:
        return 10;
        case 2:
        return 20;
        case 3:
        return 40;
    }
}

function getApi(stage) {
    switch (stage) {
        case 0:
        return "HolesDecision";
        case 1:
        return "FlopsDecision";
        case 2:
        return "TurnDecision";
        case 3:
        return "RiverDecision";
    }
}

function fold(stage) {
    var request = {GameId: gameId, PlayerBet: 0, PlayerFold: true}
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", url + getApi(stage), false);
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send( JSON.stringify(request) );
    return xmlHttp.responseText;
}