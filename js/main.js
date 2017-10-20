
// create an array with nodes



var nodes = null;
var edges = null;
var network = null;
var nodecount = null;
var edgecount = null;
var superpeercount = null;
var data = null;
var onodes = null;
var oedges = null;
var onetwork = null;
var odata = null;
var previous_super_peer_array = null;
var pathover = [];
var pathnet = [];
var netedgedict ={};
var overedgedict ={};

var options = {
    physics: false,
    layout: {randomSeed: 2},
    groups: {
        super: {color: {background: 'red'}, borderWidth: 4},
        normal: {
            color: {
                border: '#2B7CE9',
                background: '#97C2FC'
            }
        ,
        borderWidth: 1}},
    manipulation:{
        addNode: function(nodeData,callback) {
            if(onetwork!=null){
                onetwork.destroy();
                odata = null;
                oedges = null;
                onodes = null;
                pathover =[];
                pathnet = [];
                document.getElementById("route").innerHTML = "";
                document.getElementById("route1").innerHTML = "";
                previous_super_peer_array = null;
            }

            nodeData.id = String(nodecount);
            nodeData.label = String(nodecount);

            nodecount++;
            callback(nodeData);

        },
        deleteNode: true,
        addEdge: function(edgeData,callback) {
            if(onetwork!=null){
                onetwork.destroy();
                odata = null;
                oedges = null;
                onodes = null;
                pathover =[];
                pathnet = [];
                document.getElementById("route").innerHTML = "";
                document.getElementById("route1").innerHTML = "";
                previous_super_peer_array = null;
            }

            edgeData.id = String(edgecount);
            edgecount++;
            netedgedict["str"+String(edgeData.from)+String(edgeData.to)+"fin"] = edgecount-1;
            netedgedict["str"+String(edgeData.to)+String(edgeData.from)+"fin"] = edgecount-1;
            callback(edgeData);

        }
    }

};

var optionsoverlay = {
    physics: false,
    groups: {
        super: {color: {background: 'red'}, borderWidth: 4},
        normal: {color: {
                border: '#2B7CE9',
                background: '#97C2FC'
            }
        ,
        borderWidth: 1}}

};




function draw(){
    if(onetwork!=null){
        onetwork.destroy();
        odata = null;
        oedges = null;
        onodes = null;
        overedgedict = {};
        pathover =[];
        pathnet = [];
        document.getElementById("route").innerHTML = "";
        document.getElementById("route1").innerHTML = "";
        previous_super_peer_array = null;
    }

    nodecount = document.getElementById('num_nodes').value;
    netedgedict = {};
    if (isNumeric(nodecount) && nodecount > 1) {

        finaldraw();

    }else{
        window.alert("Please Input a proper value > 1");
    }

}

function finaldraw(){
    if (network !== null){
        network.destroy();
    }
    data = getnetwork(nodecount);
    nodecount = data.nodes.length;

    edgecount = data.edges.length;
    var container = document.getElementById('mynetwork');
    network = new vis.Network(container, data, options);
}




function getoverlayroute() {

    var from = document.getElementById('from').value;
    var to = document.getElementById('to').value;
    if (isNumeric(from) && (from >= 0) && (from < nodecount) && isNumeric(to) && (to >= 0) && (to < nodecount)) {
        lightoverlaypath(String(from), String(to));
        lightnetworkpath(String(from), String(to));


    } else {
        window.alert("Please Input a proper node ids");
    }

}

function showrt(){
    showrouteover();
    showroutenet();
}



function lightoverlaypath(n1,n2){
    if(pathover.length>1){
    for(var i=0;i<pathover.length-1;i++) {
        var index =overedgedict["str"+pathover[i]+pathover[i+1]+"fin"];

        if(oedges._data[index].from==pathover[i]){
            odata.edges.update({
                id:String(index),
                color:'#848484',
                arrows: ""
            });

        }else{
            odata.edges.update({
                id:String(index),
                color:'#848484',
                arrows: ""
            });

        }
    }
    }

    pathover =[];
    document.getElementById("route").innerHTML = "";
    var map = getmap(onodes,oedges._data,oedges.length);

    // for(var key in map){
    //     g.addVertex(String(key),map[key]);
    // }

    // var path = g.shortestPath(n1.toString(), n2.toString()).concat(n1.toString()).reverse();
    pathover = (new Graph(map)).findShortestPath(n1.toString(), n2.toString());
    document.getElementById("route").innerHTML = "The Path is " + pathover;

}
function showrouteover(){
    for(var i=0;i<pathover.length-1;i++) {
        var index =overedgedict["str"+pathover[i]+pathover[i+1]+"fin"];

        if(oedges._data[index].from==pathover[i]){
            odata.edges.update({
                id: String(index),
                arrows: "to",
                color: "black"
            });

        }else{
            odata.edges.update({
                id: String(index),
                arrows: "from",
                color:"black"
            });

        }
    }
}

function lightnetworkpath(n1,n2){
    if(pathnet.length>1) {
        for (var i = 0; i < pathnet.length - 1; i++) {
            var index = netedgedict["str" + pathnet[i] + pathnet[i + 1] + "fin"];

            if (edges._data[index].from == pathnet[i]) {
                data.edges.update({
                    id: String(index),
                    color: '#848484',
                    arrows: ""
                });

            } else {
                data.edges.update({
                    id: String(index),
                    color: '#848484',
                    arrows: ""
                });

            }
        }
    }

    pathnet = [];
    document.getElementById("route1").innerHTML = "";
    var map = getnetmap(data.nodes,edges._data,edges.length);
    pathnet = (new Graph(map)).findShortestPath(n1.toString(), n2.toString())
    document.getElementById("route1").innerHTML = "The Path is " + pathnet;

}

function showroutenet(){
    for(var i=0;i<pathnet.length-1;i++) {
        var index =netedgedict["str"+pathnet[i]+pathnet[i+1]+"fin"];
        console.log(index);
        if(edges._data[index].from==pathnet[i]){
            data.edges.update({
                id: String(index),
                arrows: "to",
                color: "black"
            });

        }else{
            data.edges.update({
                id: String(index),
                arrows: "from",
                color:"black"
            });

        }
    }
}





function getmap(nodes1,edges1,edgecount)
{

    var graph ={};
    for(var i =0;i<nodes1.length;i++){

        graph[i] = {};

    }

    for(var i=0;i<edgecount;i++){
        var f = edges1[i].from;
        var t = edges1[i].to;
        graph[f][t]=10;
        graph[t][f]=10;
    }

    return graph;

}

function getnetmap(nodes1,edges1,edgecount)
{

    var graph ={};
    for(var i =0;i<nodes1.length;i++){

        graph[String(i)] = {};

    }

    for(var i=0;i<edgecount;i++){
        var f = String(edges1[i].from);
        var t = String(edges1[i].to);

        graph[f][t]=10;
        graph[t][f]=10;
    }

    return graph;

}



function getoverlay(){
    superpeercount = document.getElementById('num_superpeers').value;

    if (isNumeric(superpeercount) && (superpeercount>0)) {
        if(previous_super_peer_array != null){
        for (i in previous_super_peer_array) {
            data.nodes.update({
                id: String(previous_super_peer_array[i]),
                group: 'normal'
            });
        }

            if(pathnet.length>1) {
                for (var i = 0; i < pathnet.length - 1; i++) {
                    var index = netedgedict["str" + pathnet[i] + pathnet[i + 1] + "fin"];

                    if (edges._data[index].from == pathnet[i]) {
                        data.edges.update({
                            id: String(index),
                            color: '#848484',
                            arrows: ""
                        });

                    } else {
                        data.edges.update({
                            id: String(index),
                            color: '#848484',
                            arrows: ""
                        });

                    }
                }
            }
    }
        overedgedict = {};
        document.getElementById("route").innerHTML = "";
        document.getElementById("route1").innerHTML = "";
        pathnet = [];
        pathover = [];
        var superpeerarray = getsuperpeer();

        previous_super_peer_array = superpeerarray;

        odata = getoverlaynodeedge(superpeerarray);

        var container = document.getElementById('mynetworkoverlay');
        onetwork = new vis.Network(container, odata , optionsoverlay);
    }else{
        window.alert("Please Input a proper super peer number");
    }
}

function getoverlaynodeedge(superpeerarray){
    onodes = [];
    oedges = [];
    connectionCount = [];

    connection_array = {};

    for (var i = 0;i<superpeerarray.length;i++){
        connection_array[superpeerarray[i]] = [];
    }
    for(var i =0;i<superpeerarray.length;i++) {
        onodes.push({
            id: String(superpeerarray[i]),
            label: String(superpeerarray[i]),
            group: 'super'
        });

        data.nodes.update({
                id: String(superpeerarray[i]),
                group: 'super'
        });

    }


    if(superpeerarray.length>1) {
        for (var i = 0;i<superpeerarray.length;i++){
            var from = i;
            while (connection_array[superpeerarray[i]].length < .25*superpeerarray.length){
                var temp = Array.from({length: Math.floor(.25*superpeerarray.length)}, () => Math.floor(Math.random() * superpeerarray.length));

                if (superpeerarray.length === 2) {
                    temp = [0,1];
                } else if (superpeerarray.length === 3) {
                    temp = [0,1,2];
                }
                for(var j=0;j<temp.length;j++) {
                    var to = superpeerarray[temp[j]];
                    if (!(to in connection_array[superpeerarray[i]]) && (to !== superpeerarray[i])) {
                        var n =oedges.length;
                        oedges.push({
                            id: String(n),
                            from: superpeerarray[i],
                            to: to
                        });
                        overedgedict["str"+String(superpeerarray[i])+String(to)+"fin"] = n;
                        overedgedict["str"+String(to)+String(superpeerarray[i])+"fin"] = n;
                        connection_array[superpeerarray[i]].push(to);
                        connection_array[to].push(superpeerarray[i]);
                        if(connection_array[superpeerarray[i]].length > .3*superpeerarray.length){
                            break;
                        }
                    }
                }

            }
        }

    }




    for (var i = 0; i < nodecount; i++) {
        if(superpeerarray.indexOf(i) < 0){
            onodes.push({
                id: i,
                label: String(i)
            });
            temp_index = Math.floor(Math.random() * superpeerarray.length);

            var from = i;
            var to = superpeerarray[temp_index];
            var n = oedges.length;
            oedges.push({
                id: String(n),
                from: from,
                to: to
            });

            overedgedict["str"+String(from)+String(to)+"fin"] = n;
            overedgedict["str"+String(to)+String(from)+"fin"] = n;

        }
    }
    onodes = new vis.DataSet(onodes);
    oedges = new vis.DataSet(oedges);
    return {edges:oedges,nodes:onodes};

}

function getsuperpeer() {
    if(superpeercount>nodecount){
        superpeercount = nodecount;
    }
    var temp = [];
    while(temp.length < superpeercount){
        var t = Math.floor(Math.random()*nodecount);
        if (!temp.includes(t)) {
            temp.push(t);
        }
    }

    return temp;
}

function getnetwork(nodecount){
    nodes = [];
    for(var i=0;i<nodecount;i++){
        nodes.push({
            id: String(i),
            label: String(i)
        })
    }
    var data = getrandomedges(nodes);
    return data;
}

function getrandomedges(nodes){
    edges = [];
    edgecount = 0;
    connection_array = {};
    for (var i = 0;i<nodes.length;i++){
        connection_array[i] = [];
    }
    for (var i = 0;i<nodes.length;i++){
        var from = i;
        while (connection_array[i].length < .25*nodes.length){

            var temp = Array.from({length: Math.floor(.25*nodes.length)}, () => Math.floor(Math.random() * nodes.length));

            if (nodes.length === 1) {
                temp = [0];
            } else if (nodes.length === 2) {
                temp = [0, 1];
            } else if (nodes.length === 3) {
                temp = [0, 1, 2];
            }
            for(var j=0;j<temp.length;j++) {
                var to = temp[j];
                if (!(to in connection_array[i]) && (to != i)) {
                    edges.push({
                        id: String(edgecount),
                        from: nodes[i].id,
                        to: nodes[to].id,
                    });
                    edgecount++;
                    netedgedict["str"+String(nodes[i].id)+String(nodes[to].id)+"fin"] = edgecount-1;
                    netedgedict["str"+String(nodes[to].id)+String(nodes[i].id)+"fin"] = edgecount-1;
                    connection_array[i].push(to);
                    connection_array[to].push(i);
                    if(connection_array[i].length > .3*nodes.length){
                        break;
                    }
                }
            }
            if(nodes.length===1){
                edges = [];
            }
        }
    }
    nodes = new vis.DataSet(nodes);
    edges = new vis.DataSet(edges);
    return {edges:edges,nodes:nodes};
}


function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


var Graph = (function (undefined) {

    var extractKeys = function (obj) {
        var keys = [], key;
        for (key in obj) {
            Object.prototype.hasOwnProperty.call(obj,key) && keys.push(key);
        }
        return keys;
    }

    var sorter = function (a, b) {
        return parseFloat (a) - parseFloat (b);
    }

    var findPaths = function (map, start, end, infinity) {
        infinity = infinity || Infinity;

        var costs = {},
            open = {'0': [start]},
            predecessors = {},
            keys;

        var addToOpen = function (cost, vertex) {
            var key = "" + cost;
            if (!open[key]) open[key] = [];
            open[key].push(vertex);
        }

        costs[start] = 0;

        while (open) {
            if(!(keys = extractKeys(open)).length) break;

            keys.sort(sorter);

            var key = keys[0],
                bucket = open[key],
                node = bucket.shift(),
                currentCost = parseFloat(key),
                adjacentNodes = map[node] || {};

            if (!bucket.length) delete open[key];

            for (var vertex in adjacentNodes) {
                if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
                    var cost = adjacentNodes[vertex],
                        totalCost = cost + currentCost,
                        vertexCost = costs[vertex];

                    if ((vertexCost === undefined) || (vertexCost > totalCost)) {
                        costs[vertex] = totalCost;
                        addToOpen(totalCost, vertex);
                        predecessors[vertex] = node;
                    }
                }
            }
        }

        if (costs[end] === undefined) {
            return null;
        } else {
            return predecessors;
        }

    }

    var extractShortest = function (predecessors, end) {
        var nodes = [],
            u = end;

        while (u !== undefined) {
            nodes.push(u);
            u = predecessors[u];
        }

        nodes.reverse();
        return nodes;
    }

    var findShortestPath = function (map, nodes) {
        var start = nodes.shift(),
            end,
            predecessors,
            path = [],
            shortest;

        while (nodes.length) {
            end = nodes.shift();
            predecessors = findPaths(map, start, end);

            if (predecessors) {
                shortest = extractShortest(predecessors, end);
                if (nodes.length) {
                    path.push.apply(path, shortest.slice(0, -1));
                } else {
                    return path.concat(shortest);
                }
            } else {
                return null;
            }

            start = end;
        }
    }

    var toArray = function (list, offset) {
        try {
            return Array.prototype.slice.call(list, offset);
        } catch (e) {
            var a = [];
            for (var i = offset || 0, l = list.length; i < l; ++i) {
                a.push(list[i]);
            }
            return a;
        }
    }

    var Graph = function (map) {
        this.map = map;
    }

    Graph.prototype.findShortestPath = function (start, end) {
        if (Object.prototype.toString.call(start) === '[object Array]') {
            return findShortestPath(this.map, start);
        } else if (arguments.length === 2) {
            return findShortestPath(this.map, [start, end]);
        } else {
            return findShortestPath(this.map, toArray(arguments));
        }
    }

    Graph.findShortestPath = function (map, start, end) {
        if (Object.prototype.toString.call(start) === '[object Array]') {
            return findShortestPath(map, start);
        } else if (arguments.length === 3) {
            return findShortestPath(map, [start, end]);
        } else {
            return findShortestPath(map, toArray(arguments, 1));
        }
    }

    return Graph;

})();
