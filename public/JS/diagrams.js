
var nodeDataArrayForGraph = [
    { key: "Start" },
    { key: "Mail box" },
    { key: "Frost config" },
    { key: "Temp file" },
    { key: "BSA status master report" },
    { key: "Authentication" },
    { key: "Search" },
    { key: "Summary" },
    { key: "Auth" },
    { key: "Terms and condition" },
    { key: "Home" },
    { key: "Save report" },
    { key: "End" },
];

var linkDataForGraph = [
    { from: "Start", to: "Mail box" },
    { from: "Mail box", to: "Frost config" },
    { from: "Frost config", to: "Temp file" },
    { from: "Temp file", to: "BSA status master report" },
    { from: "BSA status master report", to: "Authentication" },
    { from: "Authentication", to: "Search" },
    { from: "Search", to: "Summary" },
    { from: "Summary", to: "Auth" },
    { from: "Auth", to: "Terms and condition" },
    { from: "Terms and condition", to: "Home" },
    { from: "Home", to: "Save report" },
    { from: "Save report", to: "End" }
]


function drawChart() {
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram =
        $(go.Diagram, "myDiagramDiv",  // Diagram refers to its DIV HTML element by id
            {
                // start everything in the middle of the viewport
                initialContentAlignment: go.Spot.Center,
                layout: $(go.TreeLayout,  // the layout for the entire diagram
                    {
                        angle: 90,
                        arrangement: go.TreeLayout.ArrangementHorizontal,
                        isRealtime: false
                    })
            });


    // define the node template for non-groups
    myDiagram.nodeTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "Rectangle",
                { stroke: '#58595b', strokeWidth: 1 },
                new go.Binding("fill", "key")),
            $(go.TextBlock,
                { margin: 7, font: "Bold 14px Sans-Serif" },
                //the text, color, and key are all bound to the same property in the node data
                new go.Binding("text", "key"))
        );

    // link template

    myDiagram.linkTemplate =
        $(go.Link,
            { routing: go.Link.Orthogonal, corner: 10 },
            $(go.Shape, { strokeWidth: 2 }),
            $(go.Shape, { toArrow: "OpenTriangle" })
        );


    // define the group template
    myDiagram.groupTemplate =
        $(go.Group, "Auto",
            { // define the group's internal layout
                layout: $(go.TreeLayout,
                    { angle: 90, arrangement: go.TreeLayout.ArrangementHorizontal, isRealtime: false }),
                // the group begins unexpanded;
                // upon expansion, a Diagram Listener will generate contents for the group
                isSubGraphExpanded: false,
                // when a group is expanded, if it contains no parts, generate a subGraph inside of it
                subGraphExpandedChanged: function (group) {
                    if (group.memberParts.count === 0) {
                        randomGroup(group.data.key);
                    }
                }
            },
            $(go.Shape, "Rectangle",
                { fill: null, stroke: "gray", strokeWidth: 2 }),
            $(go.Panel, "Vertical",
                { defaultAlignment: go.Spot.Left, margin: 4 },
                $(go.Panel, "Horizontal",
                    { defaultAlignment: go.Spot.Top },
                    // the SubGraphExpanderButton is a panel that functions as a button to expand or collapse the subGraph
                    $("SubGraphExpanderButton"),
                    $(go.TextBlock,
                        { font: "Bold 18px Sans-Serif", margin: 4 },
                        new go.Binding("text", "key"))
                ),
                // create a placeholder to represent the area where the contents of the group are
                $(go.Placeholder,
                    { padding: new go.Margin(0, 10) })
            )  // end Vertical Panel
        );  // end Group

    // generate the initial model
    randomGroup();

    // Generate a random number of nodes, including groups.
    // If a group's key is given as a parameter, put these nodes inside it
    function randomGroup(group) {
        // all modification to the diagram is within this transaction
        myDiagram.startTransaction("addGroupContents");
        var addedKeys = [];  // this will contain the keys of all nodes created
        var groupCount = 0;  // the number of groups in the diagram, to determine the numbers in the keys of new groups
        myDiagram.nodes.each(function (node) {
            if (node instanceof go.Group) groupCount++;
        });
        // create a random number of groups
        // ensure there are at least 10 groups in the diagram
        var groups = Math.floor(Math.random() * 2);
        if (groupCount < 10) groups += 1;
        for (var i = 0; i < groups; i++) {
            var name = "group" + (i + groupCount);
            myDiagram.model.addNodeData({ key: name, isGroup: true, group: group });
            addedKeys.push(name);
        }
        var nodes = Math.floor(Math.random() * 3) + 2;
        // create a random number of non-group nodes
        for (var i = 0; i < nodes; i++) {
            var color = go.Brush.randomColor();
            // make sure the color, which will be the node's key, is unique in the diagram before adding the new node
            if (myDiagram.findPartForKey(color) === null) {
                myDiagram.model.addNodeData({ key: color, group: group });
                addedKeys.push(color);
            }
        }
        // add at least one link from each node to another
        // this could result in clusters of nodes unreachable from each other, but no lone nodes
        var arr = [];
        for (var x in addedKeys) arr.push(addedKeys[x]);
        arr.sort(function (x, y) { return Math.random(2) - 1; });
        for (var i = 0; i < arr.length; i++) {
            var from = Math.floor(Math.random() * (arr.length - i)) + i;
            if (from !== i) {
                myDiagram.model.addLinkData({ from: arr[from], to: arr[i] });
            }
        }
        myDiagram.commitTransaction("addGroupContents");
    }



}

function drawSimple() {

    var $ = go.GraphObject.make;  // for conciseness in defining templates
    myDiagram_simple = $(go.Diagram, "simpleDiagram");
    myDiagram_simple.initialContentAlignment = go.Spot.Center;

    myDiagram_simple.model = $(go.Model, {
        nodeDataArray: [
            { key: "textboxone" },
            { key: "textboxtwo" }
        ]
    });
}


function graphLinkModel() {

    var $ = go.GraphObject.make;  // for conciseness in defining templates
    myDiagram_graph = $(go.Diagram, "graphLinksModelDiagram", { layout: $(SerpentineLayout) });
    myDiagram_graph.initialContentAlignment = go.Spot.Center;

    myDiagram_graph.nodeTemplate = $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle", { fill: '#BBDFF8', stroke: '#1E88E5', strokeWidth: 1 }),
        $(go.TextBlock, { margin: 8 }, new go.Binding('text', 'key'))
    )

    var linkColorFlag = true;
    var linkColorRed = $(go.Link,
        $(go.Shape, { stroke: 'red' }),  // the link shape
        $(go.Shape,   // the arrowhead
            { toArrow: "OpenTriangle", fill: null, stroke: 'red' })
    );

    var linkColorGreen = $(go.Link,
        $(go.Shape, { stroke: 'green' }),  // the link shape
        $(go.Shape,   // the arrowhead
            { toArrow: "OpenTriangle", fill: null, stroke: 'green' })
    );

    myDiagram_graph.linkTemplate = linkColorRed


    // setInterval(function(){
    //     linkColorFlag = !linkColorFlag;
    //     if(!linkColorFlag) {
            
    //         myDiagram_graph.linkTemplate = linkColorGreen;
    //     }
    //     else {
    //         myDiagram_graph.linkTemplate = linkColorGreen;
    //     }
    // },250)


    //GraphLinksModel takes two array as parameters. first => nodeDataArray, second => linkDataArray
    myDiagram_graph.model = new go.GraphLinksModel(
        // [
        //   {
        //     key: "textboxone",
        //   },
        //   {
        //     key: "textboxtwo",
        //   }
        // ],
        // [
        //   {
        //     from: 'textboxone',
        //     to: 'textboxtwo'

        //   }
        // ]
        nodeDataArrayForGraph, linkDataForGraph
    );
}

function treeModel() {
    var $ = go.GraphObject.make;  // for conciseness in defining templates
    myDiagram_tree = $(go.Diagram, "treeModelDiagram");
    myDiagram_tree.initialContentAlignment = go.Spot.Center;

    myDiagram_tree.nodeTemplate = $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle", new go.Binding("fill", "color")),
        $(go.TextBlock, { margin: 8 }, new go.Binding('text', 'key'))
    )

    myDiagram_tree.model = new go.TreeModel([
        { key: 'Alpha', color: 'orange' },
        { key: 'Beta', color: 'orange', parent: 'Alpha' },
        { key: 'Gamma', color: 'orange', parent: 'Alpha' },
        { key: 'Delta', color: 'orange', parent: 'Gamma' },
    ])
}

function showSimpleJson() {
    $('#simpleJson pre').html(myDiagram_simple.model.toJSON())
}
function showGraphJson() {
    $('#graphJson pre').html((myDiagram_graph.model.toJson()))
}
function showTreeJson() {
    $('#treeJson pre').html(myDiagram_tree.model.toJSON())
}