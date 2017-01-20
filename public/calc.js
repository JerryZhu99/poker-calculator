
var suits = ["diamonds","clubs","hearts","spades"];
var nums = ["ace","2","3","4","5","6","7","8","9","10","jack","queen","king"]


var carddiv = d3.select(".cards");
for(var s=0;s<suits.length;s++){
    for(var n=0;n<nums.length;n++){
        var button = carddiv.append("button")
        .attr("class","card-button")
        .attr("onclick","cardSelected('"+nums[n]+"','"+suits[s]+"')");
        button.append("img").data([0])
        .attr("src","images/"+nums[n]+"_of_"+suits[s]+".png")
        .attr("class","card")
    }
    carddiv.append("br");
}

function cardSelected(num, suit){
    console.log(num+","+suit)
}
var data = [100,122,213,323,121];

var svg = d3.select(".chart"),
margin = {top: 20, right: 20, bottom: 30, left: 40},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.5),
y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = [{hand:"High Card",probability:0.07,opp:0},{hand:"High Card",probability:0.28,opp:1},{hand:"One Pair",probability:0.60,opp:0},{hand:"Two Pairs",probability:0.30,opp:0}];



x.domain(data.map(function(d) { return d.hand; }));
y.domain([0, d3.max(data, function(d) { return d.probability; })]);

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
.text("Frequency");

g.selectAll(".bar")
.data(data)
.enter().append("rect")
.attr("class", "bar")
.attr("x", function(d) { return x(d.hand)+d.opp*(x.bandwidth()/2); })
.attr("y", function(d) { return y(d.probability); })
.attr("width", x.bandwidth()/2)
.attr("height", function(d) { return height - y(d.probability); })
.attr("fill", function(d) { return d.opp?"red":"black"});
