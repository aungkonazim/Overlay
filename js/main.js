
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
            }

            edgeData.id = String(edgecount);
            edgecount++;
            callback(edgeData);

        }
    }

};

var optionsoverlay = {
    physics: false,
    layout: {randomSeed: 2},
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
    }

    nodecount = document.getElementById('num_nodes').value;

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
function getoverlayroute(){
    var from = document.getElementById('from').value;
    var to = document.getElementById('to').value;
    if (isNumeric(from) && (from>=0) && (from<nodecount) && isNumeric(to) && (to>=0) && (to<nodecount)){
        lightoverlaypath(String(from),String(to));
        lightnetworkpath(String(from),String(to));
    }else{
        window.alert("Please Input a proper node ids");
    }

}
function lightoverlaypath(n1,n2){

    for(var i=0;i<oedges.length;i++){
        odata.edges.update({
           id:String(i),
           color:'#848484',
           arrows: ""
        });

    }

    var map = getmap(onodes,oedges._data,oedges.length);
    var g = new Graph();
    for(var key in map){
        g.addVertex(String(key),map[key]);
    }

    var path = g.shortestPath(n1.toString(), n2.toString()).concat(n1.toString()).reverse();


    for(var i=0;i<path.length-1;i++) {
        var index =findedgeindex(oedges,path[i],path[i+1]);

        if(oedges._data[index].from==path[i]){
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

    for(var i=0;i<edges.length;i++){
        data.edges.update({
            id:String(i),
            color:'#848484',
            arrows: ""
        });

    }

    var map = getnetmap(data.nodes,edges._data,edges.length);
    var g1 = new Graph();
    for(var key in map){
        g1.addVertex(String(key),map[key]);
    }

    var path = g1.shortestPath(n1.toString(), n2.toString()).concat(n1.toString()).reverse();
    console.log(path);

    for(var i=0;i<path.length-1;i++) {
        var index =findedgeindex(edges,path[i],path[i+1]);

        if(edges._data[index].from==path[i]){
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





function findedgeindex(edges1,node1,node2){

    for(var i=0;i<edges1.length;i++){
        var f = edges1._data[i].from;
        var t = edges1._data[i].to;
        if((f==node1) && (t==node2)){
            return i;
        }
        if((f==node2) && (t==node1)){
            return i;
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
    console.log(edges1);
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

    if (isNumeric(superpeercount) && (superpeercount>0)){

        for(i in previous_super_peer_array){
            data.nodes.update({
                id: String(previous_super_peer_array[i]),
                group: 'normal'
            });
        }

        for(var i=0;i<edges.length;i++){
            data.edges.update({
                id:String(i),
                color:'#848484',
                arrows: ""
            });

        }
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
                        })
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