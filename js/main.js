
// create an array with nodes

var nodecount = 1;
var id = [];
var nodes = [];
var edges = [];
// create a network
var network;
var key_collection = [];
var data_node = {};

var options = {layout:{randomSeed:2}};
id.push(0);
nodes.push({
    id: 0,
    label: String(0)

});
data_node[id[0]] = {};

draw(nodes, edges, options);

function draw(nodes, nodecount, options) {
    var edges = [];
    if(nodecount>1){
        for (var i = 0; i < nodecount; i++) {
            if (i === (nodecount - 1)) {
                edges.push({
                    id: String(id[nodecount-1])+String(id[0]),
                    from: id[nodecount - 1],
                    to: id[0],
                    color: "yellow"
                });
            } else {
                edges.push({
                    id: String(id[i])+String(id[i+1]),
                    from: id[i],
                    to: id[i + 1],
                    color: "yellow"
                });
            }
        }
    }
    var container = document.getElementById('mynetwork');
    var data = {nodes: nodes, edges: edges};
    network = new vis.Network(container, data, options);
    

}
function draw1(nodes,edges,options){
    var container = document.getElementById('mynetwork');
    var data = {nodes: nodes, edges: edges};
    network = new vis.Network(container, data, options);
}



function addnode() {
    var new_id = Math.floor(Math.random() * 10000);
    while (id.includes(new_id)) {
        new_id = Math.floor(Math.random() * 10000);
    }
    id.push(new_id);
    id.sort(function(a,b) { return  a-b; });
    
    nodecount++;
    edges = [];
    nodes.push({
            id: new_id,
            label: String(new_id)
        });
    data_node
    nodes.sort(function(a,b) { return  a.id-b.id; });   
    var index = id.indexOf(new_id);
    console.log(data_node);
    if (index==nodecount-1){
    data_node[new_id] = {};
    }else{
        data_node[new_id] = {};
        
        for (var key in data_node[id[index+1]]){
            if(key<=new_id){
                data_node[new_id][key] = data_node[id[index+1]][key];
                delete data_node[id[index+1]][key];
            }
        }
    }
    console.log(data_node);
    draw(nodes, nodecount, options);

}

function delnode(){
    
    var n_id = document.getElementById('to_delete').value;
    
    if (isNumeric(n_id)){
    var check_pre = 0;
    for(var i = 0; i <nodecount; i++) {
        if(id[i] == n_id) {
           if(i==nodecount-1){
               for (var key in data_node[id[i]]){
                   console.log(key);
//                   delete key in key_collection;
                   var s = key_collection.indexOf(key);
                   key_collection.splice(s,1);
               }
               delete data_node[id[nodecount-1]];
           }else{
               for(var key in data_node[id[i]]){
                data_node[id[i+1]][key] = data_node[id[i]][key];
               }
               delete data_node[id[i]];
           }  
           id.splice(i, 1);
           nodes.splice(i,1);
           check_pre = 1;
           break;
        }
    }
    if (check_pre==1){
        nodecount--;
        draw(nodes,nodecount,options);
    }else{
        window.alert("The node does not exist");
    }}else{
        window.alert("Give a proper id");
    }
    


} 


function insertdata(){
    
    var item = document.getElementById('to_insert').value;
    
    if(item.length>0){
            var sum = 0;
            for (var i = 0; i < item.length; i++) {
                sum = sum + item.charCodeAt(i);
            }
        
    
    if(sum <= id[nodecount-1]){
    if (key_collection.indexOf(sum)===-1){
        key_collection.push(sum);
        var f = binarySearch(id,sum);
        data_node[id[f[1]]][sum] = item;
        window.alert("Data "+ item + " saved with key = " + sum + " in node= " + id[f[1]]);    
//        var nodes1 = JSON.parse(JSON.stringify( nodes ));;
//        
//         nodes[f[1]].color = 'red';
//        draw(nodes1,nodecount,options);
//        
       draw(nodes,nodecount,options);
    }else{
        window.alert("this data already exists");
        draw(nodes,nodecount,options);
    }
    }else{
        window.alert("what you have entered has a key that exceeds the maximum node id so it can not be stored" + "key = "+ sum + " maximum nodeid = "+ id[nodecount-1]);
    }
    }else{
        window.alert("you have not entered anything");
    }
    
        
}

function insertkey(){
    
    var item = document.getElementById('to_insert_key').value;
    
    if(item.length>0){
            var sum = item;
            item = "";
        
    
    if(sum <= id[nodecount-1]){
    if (key_collection.indexOf(sum)===-1){
        key_collection.push(sum);
        var f = binarySearch(id,sum);
        data_node[id[f[1]]][sum] = item;
        window.alert("Key = " + sum + " saved in node= " + id[f[1]]);    
//        var nodes1 = JSON.parse(JSON.stringify( nodes ));;
//        
//         nodes[f[1]].color = 'red';
//        draw(nodes1,nodecount,options);
//        
       draw(nodes,nodecount,options);
    }else{
        window.alert("this key already exists");
        draw(nodes,nodecount,options);
    }
    }else{
        window.alert("what you have entered has a key that exceeds the maximum node id so it can not be stored" + "key = "+ sum + " maximum nodeid = "+ id[nodecount-1]);
    }
    }else{
        window.alert("you have not entered anything");
    }
    
        
}




function lookupdata(){
    var sum = document.getElementById('to_lookup').value;
    if(sum.length>0){
        
        var edges = [];
        if(nodecount>1){
            for (var i = 0; i < nodecount; i++) {
                if (i === (nodecount - 1)) {
                    edges.push({
                        id: String(id[nodecount-1])+String(id[0]),
                        from: id[nodecount - 1],
                        to: id[0],
                        
                    });
                } else {
                    edges.push({
                        id: String(id[i])+String(id[i+1]),
                        from: id[i],
                        to: id[i + 1],
                        
                    });
                }
            }
        }
        var check = 0;
        if (data_node[id[0]][sum] != undefined){
                    document.getElementById('output').innerHTML = "For key = "+sum+" data is found in node = "+ id[0]+" with value = " + data_node[id[0]][sum];
                    check = 1;
                    
        }
        if(check==0){
            for (var i = 0; i < nodecount-1; i++){
                edges[i].color = "red";
                edges[i].arrows = "to";
                draw1(nodes,edges,options);
                if(id[i]<sum && id[i+1]>=sum){

                    if (data_node[id[i+1]][sum] != undefined){
                        document.getElementById('output').innerHTML = "For key = "+sum+" data is found in node = "+ id[i+1]+" with value = " + data_node[id[i+1]][sum];
                        check = 1;
                        break;
                    }else{
                        
                        window.alert("Data does not exist for this key");
                        check = 1;
                        break;
                    }

                }            
            }
        }
        if (check==0 && sum <= id[nodecount-1] ){
            if (data_node[id[nodecount-1]][sum] != undefined){
                    document.getElementById('output').innerHTML = "For key = "+sum+" data is found in node = "+ id[nodecount-1]+" with value = " + data_node[id[nodecount-1]][sum];
                    check=1;
                    }else{
//                    edges[nodecount-1].color = "red";
//                    edges[nodecount-1].arrows = "to";
                   
                    window.alert("Data does not exist for this key");
                    
                }
        }
        if(check==0){
            window.alert("Data does not exist for this key");
        }
    
     
          
    }else{
        window.alert("you have not entered anything");
    }
    
}


function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}




function binarySearch(data, val){
    var highIndex = data.length -1;
    var lowIndex = 0;
    var index = 0;
    var sub = 0;
    while (highIndex > lowIndex){
            index = parseInt((highIndex + lowIndex) / 2);
            sub = data[index];
            if (data[lowIndex] == val)
                    return [lowIndex, lowIndex];
            else if (sub == val)
                    return [index, index];
            else if (data[highIndex] == val)
                    return [highIndex, highIndex];
            else if (sub > val){
                    if (highIndex == index){
                            return [highIndex, lowIndex].sort(function(a,b) { return  a-b; });
                        }
                    highIndex = index;
                }
            else{
                    if (lowIndex == index)
                            return [highIndex, lowIndex].sort(function(a,b) { return  a-b; });
                    lowIndex = index;
                }
    }
    return [highIndex, lowIndex].sort(function(a,b) { return  a-b; });
}


function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}

