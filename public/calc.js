
var suits = ["diamonds","clubs","hearts","spades"];
var nums = ["ace","2","3","4","5","6","7","8","9","10","jack","queen","king"]
var hands=["4 of a Kind", "Straight Flush", "Straight", "Flush", "High Card", "1 Pair", "2 Pair", "Royal Flush", "3 of a Kind", "Full House"];
var orderedHands=["High Card", "1 Pair", "2 Pair", "3 of a Kind", "Straight", "Flush", "Full House", "4 of a Kind", "Straight Flush", "Royal Flush"];
var indices=[7,8,4,5,0,1,2,9,3,6];
function Card(num, suit){
    this.suit = suit;
    this.num = num;
}
var deck = [];
var player=[];
var table=[];
for(var s=0;s<suits.length;s++){
    for(var n=0;n<nums.length;n++){
        deck.push(new Card(nums[n],suits[s]));
    }
}
var activeDeck = deck.slice(0);
function reset(){
    activeDeck = deck.slice(0);
}
function draw(card){
    if(card){
        activeDeck.splice(activeDeck.indexOf(card),1);
        return card;
    }
    var i = Math.floor(Math.random()*activeDeck.length);
    var c = activeDeck[i];
    activeDeck.splice(i,1);
    return c;
}
function resetResults(){
    playerResults = [0,0,0,0,0,0,0,0,0,0];
    opponentResults = [0,0,0,0,0,0,0,0,0,0];
    wins=0;
    losses=0;
    ties=0;
}
var playerResults = [0,0,0,0,0,0,0,0,0,0];
var opponentResults = [0,0,0,0,0,0,0,0,0,0];
var wins=0;
var losses=0;
var ties=0;
var total=0;
var carddiv = d3.select(".cards")
var button = carddiv.selectAll("button")
.data(deck)
.enter()
.append("button")
.attr("class","card-button")
.attr("onclick",function(d){return "cardSelected('"+deck.indexOf(d)+"')"})
.attr("data",function(d){return ""+deck.indexOf(d)+""});
button.append("img")
.attr("src",function(d){return "images/"+d.num+"_of_"+d.suit+".png"})
.attr("class","card");
carddiv.append("br");

function cardSelected(index){
    var card = deck[index];

    if(player.length<2){
        d3.select("button[data='"+index+"']")
        .classed("selected",true)
        .attr("disabled",true);
        d3.select(".player-cards")
        .append("button")
        .attr("class","card-button-lg")
        .attr("onclick", "cardPlayer('"+card.num+"','"+card.suit+"')")
        .attr("data",card.num+","+card.suit)
        .append("img")
        .attr("src", "images/"+card.num+"_of_"+card.suit+".png")
        .attr("class","card");
        player.push(card);
    }else if(table.length<5){
        d3.select("button[data='"+index+"']")
        .classed("selected",true)
        .attr("disabled",true);
        d3.select(".table-cards")
        .append("button")
        .attr("class","card-button-lg")
        .attr("onclick", "cardTable('"+card.num+"','"+card.suit+"')")
        .attr("data",card.num+","+card.suit)
        .append("img")
        .attr("src", "images/"+card.num+"_of_"+card.suit+".png")
        .attr("class","card");
        table.push(card);
    }else{
        return;
    }
    calcNewProbabilities();
}
function cardPlayer(num,suit){
    player.splice(player.indexOf(new Card(num,suit)));
    var index = suits.indexOf(suit)*13+nums.indexOf(num);
    d3.select("button[data='"+index+"']")
    .classed("selected",false)
    .attr("disabled",null);
    d3.select(".player-cards").select("button[data='"+num+","+suit+"']").remove();
    calcNewProbabilities();
}
function cardTable(num, suit){
    table.splice(table.indexOf(new Card(num,suit)));
    var index = suits.indexOf(suit)*13+nums.indexOf(num);
    d3.select("button[data='"+index+"']")
    .classed("selected",false)
    .attr("disabled",null);
    d3.select(".table-cards").select("button[data='"+num+","+suit+"']").remove();
    calcNewProbabilities();
}

function calcNewProbabilities(){
    resetResults();
    calcProbabilities();
}
function calcProbabilities(){
    for(var i=0;i<2000;i++){
        reset();
        var p1 = draw(player[0]);
        var p2 = draw(player[1]);
        var t1 = draw(table[0]);
        var t2 = draw(table[1]);
        var t3 = draw(table[2]);
        var t4 = draw(table[3]);
        var t5 = draw(table[4]);
        var o1 = draw();
        var o2 = draw();

        var resultPlayer = rankPokerHands([p1,p2,t1,t2,t3,t4,t5],true);
        var resultOpponent = rankPokerHands([o1,o2,t1,t2,t3,t4,t5]);
        playerResults[resultPlayer.hand]++;
        opponentResults[resultOpponent.hand]++;
        if(resultPlayer.hand>resultOpponent.hand){
            wins++;
        }else if(resultPlayer.hand<resultOpponent.hand){
            losses++;
        }else{
            if(resultPlayer.val>resultOpponent.val){
                wins++;
            }else if(resultPlayer.val<resultOpponent.val){
                losses++;
            }else{
                ties++;
            }
        }
    }
    total = wins+losses+ties;
    d3.select("#sample").text(total);
    data = [];
    orderedHands.forEach(function(elem){
        data.push({hand:elem,probability:playerResults[orderedHands.indexOf(elem)]/total,opp:0});
        data.push({hand:elem,probability:opponentResults[orderedHands.indexOf(elem)]/total,opp:1});
    });
    updateData();
}

//Calculates the Rank of a 5 card Poker hand using bit manipulations.
function rankPokerHand(cards) {
var cs = [];
var ss = [];
cards.forEach(function(elem){
    cs.push(elem.num==nums[0]?14:nums.indexOf(elem.num)+1);
    ss.push(Math.pow(2,suits.indexOf(elem.suit)));
});
console.log(JSON.stringify(ss))
  var v, i, o, s = 1<<cs[0]|1<<cs[1]|1<<cs[2]|1<<cs[3]|1<<cs[4];
  for (i=-1, v=o=0; i<5; i++, o=Math.pow(2,cs[i]*4)) {v += o*((v/o&15)+1);}
  v = v % 15 - ((s/(s&-s) == 31) || (s == 0x403c) ? 3 : 1);
  v -= (ss[0] == (ss[1]|ss[2]|ss[3]|ss[4])) * ((s == 0x7c00) ? -5 : 1);

cs.sort(function(a,b){
    return a-b;
});
  var n = (((((cs[4])*100+cs[3])*100+cs[2])*100+cs[1])*100)+cs[0];
 // console.log(JSON.stringify(cs));
 // console.log(n);
 // console.log(indices[v])
  return {hand:indices[v],val:n}
}
function rankPokerHands(cards,debug){
    var bestCards;
    var bestHand=0;
    var bestVal=0;
    var n = cards.length;
    for(var i=0;i<n;i++){
        for(var j=i+1;j<n;j++){
            for(var k=j+1;k<n;k++){
                for(var l=k+1;l<n;l++){
                    for(var m=l+1;m<n;m++){
                        var testCards = [cards[i],cards[j],cards[k],cards[l],cards[m]];
                        var results =  rankPokerHand(testCards);
                        if(results.hand>bestHand){
                            bestHand = results.hand;
                            bestVal = results.val;
                            bestCards = testCards;
                        }else if(results.hand==bestHand&&results.val>bestVal){
                            bestHand = results.hand;
                            bestVal = results.val;
                            bestCards = testCards;
                        }
                    }
                }
            }
        }
    }
    return {hand:bestHand,val:bestVal}
}

var line = d3.select(".overall");
var xline = d3.scaleLinear().rangeRound([0, 1100]);
xline.domain([0,1])
line.append("rect")
.attr("x","0")
.attr("y","0")
.attr("width",xline(1))
.attr("height",50)
.attr("style","fill:black");
line.append("rect")
.attr("x",xline(1))
.attr("y",0)
.attr("width",xline(9))
.attr("height",50)
.attr("style","fill:red");
line.append("rect")
.attr("x",xline(1))
.attr("y",0)
.attr("width",xline(9))
.attr("height",50)
.attr("style","fill:red");


var svg = d3.select(".chart"),
margin = {top: 20, right: 20, bottom: 30, left: 40},
width = +1100 - margin.left - margin.right,
height = +400 - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.5),
y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = [{hand:"High Card",probability:0.07,opp:0},{hand:"High Card",probability:0.28,opp:1},{hand:"One Pair",probability:0.60,opp:0},{hand:"Two Pairs",probability:0.30,opp:0}];
calcNewProbabilities();


x.domain(data.map(function(d) { return d.hand; }));
y.domain([0, 1]);

g.append("g")
.attr("class", "axis axis--x")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x));

g.append("g")
.attr("class", "axis axis--y")
.call(d3.axisLeft(y).ticks(10, "%"))
.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 6)
.attr("dy", "0.71em")
.attr("text-anchor", "end")
.text("Probability");

g.selectAll(".bar")
.data(data)
.enter().append("rect")
.attr("class", "bar")
.attr("x", function(d) { return x(d.hand)+d.opp*(x.bandwidth()/2); })
.attr("y", function(d) { return y(d.probability); })
.attr("width", x.bandwidth()/2)
.attr("height", function(d) { return height - y(d.probability); })
.attr("fill", function(d) { return d.opp?"red":"black"});
var t = d3.transition()
    .duration(1000)
    .ease(d3.easeSin);
function updateData(){
    x.domain(data.map(function(d) { return d.hand; }));
    y.domain([0, 1]);

    g.select(".axis--x")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    g.select(".axis--y")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10, "%"))

    var bars = g.selectAll(".bar")
    .data(data);
    bars.transition(t).attr("x", function(d) { return x(d.hand)+d.opp*(x.bandwidth()/2); })
    .attr("y", function(d) { return y(d.probability); })
    .attr("width", x.bandwidth()/2)
    .attr("height", function(d) { return height - y(d.probability); })
    .attr("fill", function(d) { return d.opp?"red":"black"});
    bars.enter().append("rect")
    .attr("class", "bar")
    .merge(bars).transition(t)

    .attr("x", function(d) { return x(d.hand)+d.opp*(x.bandwidth()/2); })
    .attr("y", function(d) { return y(d.probability); })
    .attr("width", x.bandwidth()/2)
    .attr("height", function(d) { return height - y(d.probability); })
    .attr("fill", function(d) { return d.opp?"red":"black"});

    bars.exit().transition(t).attr("height",0).remove();

    line.select("rect:nth-child(1)").transition(t)
    .attr("x","0")
    .attr("y","0")
    .attr("width",xline(wins/total))
    .attr("height",20)
    .attr("style","fill:black");
    line.select("rect:nth-child(2)").transition(t)
    .attr("x",xline(wins/total))
    .attr("y",0)
    .attr("width",xline(ties/total))
    .attr("height",20)
    .attr("style","fill:grey");
    line.select("rect:nth-child(3)").transition(t)
    .attr("x",xline((wins+ties)/total))
    .attr("y",0)
    .attr("width",xline(losses/total))
    .attr("height",20)
    .attr("style","fill:red");
}
