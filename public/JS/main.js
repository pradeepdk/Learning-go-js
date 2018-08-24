var simpleFlag = false;
var graphLinkedFlag = false;
var treeModelFlag = false;

$(document).ready(function () {

  // showApproriateDiv('simple');
  // drawSimple();
  // graphLinkModel();
  // treeModel();

  var app = Sammy('#main', function () {

    showApproriateDiv();
    // define a 'route'
    this.get('#simple', function () {
      
      showApproriateDiv('simple');
      if(!simpleFlag)
        drawSimple();

      simpleFlag = true;
      
    });
    this.get('#graphLinksModel', function () {
     
      showApproriateDiv('graphLinksModel');
      if(!graphLinkedFlag)
        graphLinkModel();

      graphLinkedFlag = true;
      
    });
    this.get('#treeModel', function () {
      
      showApproriateDiv('treeModel');
      if(!treeModelFlag)
        treeModel();

      treeModelFlag = true;
      
      
    });

  });

  app.run('#simple');

});

function showApproriateDiv(divName) {
  
    $('.eachLinkDiv').hide();
    $('.eachLinkDiv[data-divname=' + divName + ']').show();
   
}
