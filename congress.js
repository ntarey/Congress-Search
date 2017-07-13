/*function billDetails(){
    $('#carousel').carousel('next');
}
*/


var app = angular.module('angularTable', ["angularUtils.directives.dirPagination","ngStorage"]);

app.controller('displayContent',function($scope, $http, $localStorage){
    $scope.isFavorite = [];
    $scope.isFav = [];
    $scope.lcount = 0;
    $scope.bcount = 0;
    $scope.ccount = 0;
    
    for(var i=0; i<localStorage.length; i++){
        if(JSON.parse(localStorage.getItem(localStorage.key(i))).govtrack_id){
            $scope.lcount++;
        }
        else if(JSON.parse(localStorage.getItem(localStorage.key(i))).bill_id){
            $scope.bcount++;
        }
        else if(JSON.parse(localStorage.getItem(localStorage.key(i))).committee_id){
            $scope.ccount++;
        }
        
    }
    
    
    $http({
        method: 'GET',
        responseType: 'json',
        url: 'http://www-scf.usc.edu/~tarey/CongressSearch/index.php',
        //url: 'http://sample-env.muzixdybfg.us-west-2.elasticbeanstalk.com',
        params: {database: 'Legislators'}
        }).then(function successCall(response){
		
                $scope.content = [];
                $scope.content = response.data.results;
                });
    
         $scope.tab = function(tabValue, ordVal){
                    $scope.stateVal = '';  
                 $scope.filterVal = tabValue;
                 $scope.orderVal = ordVal;
                    $scope.search = '';
                if(tabValue == 'house'){
                    $scope.myText = "Legislators by House";
                }
             else if(tabValue == 'senate'){
                 $scope.myText = "Legislators by Senate";
             }
             else{
                 $scope.myText = "Legislators by State";
             }
                 
             }
         
         $scope.billTab = function(tabValue){
             $scope.bTab = tabValue;
                 $http({
                method: 'GET',
                responseType: 'json',
                url: 'http://www-scf.usc.edu/~tarey/CongressSearch/index.php',
                //url: 'http://sample-env.muzixdybfg.us-west-2.elasticbeanstalk.com',
                 params: {database: 'Bills', status: tabValue}
                }).then(function successCall(response){
                $scope.billContent = [];
                $scope.billContent = response.data.results;
                });
         }
         
         $scope.dispState = function(){
                 $scope.stateVal = $scope.opt;
             }
         
         $scope.commTab = function(comm, commFilter){
             $scope.cTab = comm;
             $scope.commFilter = commFilter;
         }
               
         $scope.dispMain = function(navValue){
             $scope.navTab = navValue;
             if(navValue == 'bills'){
                 $http({
                method: 'GET',
                responseType: 'json',
               url: 'http://www-scf.usc.edu/~tarey/CongressSearch/index.php',
                //url: 'http://sample-env.muzixdybfg.us-west-2.elasticbeanstalk.com',
                 params: {database: 'Bills', status: 'Active Bills'}
                }).then(function successCall(response){
                $scope.billContent = [];
                $scope.billContent = response.data.results;
                });
             }
             else if(navValue == 'committees'){
                 $scope.commFilter = 'house';
                 $scope.favStar = "clicked";
                 $http({
                method: 'GET',
                responseType: 'json',
                 url: 'http://www-scf.usc.edu/~tarey/CongressSearch/index.php',
                //url: 'http://sample-env.muzixdybfg.us-west-2.elasticbeanstalk.com',
                 params: {database: 'Committees', status: 'House'}
                }).then(function successCall(response){
                $scope.commContent = [];
                $scope.commContent = response.data.results;
                });
             }
             else if(navValue == 'favorites'){
                $scope.favData = []; 
                $scope.favFilter = "legislators";
                for(var i=0; i<localStorage.length; i++){
                   $scope.favData[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
                }
             }
         }
         
    
        
         $scope.billDetails = function(data){
             $('#carousel').carousel('next');
             $scope.bdata = data;
         }
         
         $scope.legDetails = function(data){
             $('#legCarousel').carousel('next');
             $scope.ldata = data;
             
            $scope.person_id = $scope.ldata.bioguide_id ;
             
             var date1 = new Date($scope.ldata.term_start);
             var date2 = new Date($scope.ldata.term_end);
             var today = new Date();
            var date1 = date1.getTime();
             var date2 = date2.getTime();
             var total = date2 - date1;
             var passed = today.getTime() - date1;
             
             var perc = Math.round((passed/total)*100);
             
             $scope.term = perc;
             
             $http({
                method: 'GET',
                responseType: 'json',
                 url: 'http://www-scf.usc.edu/~tarey/CongressSearch/index.php',
                 //url: 'http://sample-env.muzixdybfg.us-west-2.elasticbeanstalk.com',
                 params: {database: 'Committees', filter: $scope.person_id}
                }).then(function successCall(response){
                $scope.person = [];
                $scope.person = response.data.results;
                });
             
             $http({
                method: 'GET',
                responseType: 'json',
                 url: 'http://www-scf.usc.edu/~tarey/CongressSearch/index.php',
                 //url: 'http://sample-env.muzixdybfg.us-west-2.elasticbeanstalk.com',
                 params: {database: 'Bills', filter: $scope.person_id}
                }).then(function successCall(response){
                $scope.bills = [];
                $scope.bills = response.data.results;
                });    
         }
         
          $scope.fav = function(fav_item){ 
            $scope.cid = fav_item.committee_id;
              var id = $scope.cid;
              if(localStorage.getItem(id) && JSON.parse(localStorage.getItem(id)).committee_id == id){
                $scope.isFavorite[id] = false;
                localStorage.removeItem(id);
                $scope.ccount--;
              }
              else{
                  $scope.isFavorite[id] = true;
                  $scope.ccount++;
                localStorage.setItem(id,JSON.stringify(fav_item));
              }
              
             
         }
          
           $scope.lfav = function(fav_item){ 
            $scope.lid = fav_item.bioguide_id;
              var id = $scope.lid;
              if(localStorage.getItem(id) && JSON.parse(localStorage.getItem(id)).bioguide_id == id){
                $scope.isFavorite[id] = false;
                localStorage.removeItem(id); 
                  $scope.lcount--;
              }
              else{
                  $scope.isFavorite[id] = true;
                localStorage.setItem(id,JSON.stringify(fav_item));
                  $scope.lcount++;
              }
         }
           
           
           
           $scope.bfav = function(fav_item){ 
            $scope.bid = fav_item.bill_id;
              var id = $scope.bid;
              if(localStorage.getItem(id) && JSON.parse(localStorage.getItem(id)).bill_id == id){
                $scope.isFavorite[id] = false;
                localStorage.removeItem(id); 
                  $scope.bcount--;
              }
              else{
                  $scope.isFavorite[id] = true;
                localStorage.setItem(id,JSON.stringify(fav_item));
                  $scope.bcount++;
              }
              
             
         }
           
           $scope.delFavLeg = function(id){
               var index = -1;		
		     // var comArr = eval( $scope.companies );
		  for( var i = 0; i < $scope.favData.length; i++ ) {
			 if( $scope.favData[i].bioguide_id === id ) {
				index = i;
				break;
			}
		}
		$scope.favData.splice( index, 1 );	
               localStorage.removeItem(id);
               $scope.isFavorite[id] = false;
               $scope.lcount--;
           }
           
           
           $scope.delFavBill = function(id){
               var index = -1;		
		     // var comArr = eval( $scope.companies );
		  for( var i = 0; i < $scope.favData.length; i++ ) {
			 if( $scope.favData[i].bill_id === id ) {
				index = i;
				break;
			}
          }
		$scope.favData.splice( index, 1 );	
               localStorage.removeItem(id);
               $scope.isFavorite[id] = false;
               $scope.bcount--;
           }
           
           $scope.delFavComm = function(id){
               var index = -1;		
		     // var comArr = eval( $scope.companies );
		  for( var i = 0; i < $scope.favData.length; i++ ) {
			 if( $scope.favData[i].committee_id === id ) {
				index = i;
				break;
			}
          }
               
		$scope.favData.splice( index, 1 );	
               localStorage.removeItem(id);
               $scope.isFavorite[id] = false;
               $scope.ccount--;
           }
           
           
           $scope.dispFav = function(filter){
               $scope.favTab = filter;
           }
           
        $scope.checkFav = function(favid){
            return localStorage.getItem(favid);
        }
        
        $scope.moveLeg = function(item){
            
            window.location = "#legDiv";
            $scope.navTab = "legislators";
            $scope.legDetails(item);
        }
        
        $scope.moveBill = function(item){
            
            window.location = "#billDiv";
            $scope.navTab = "bills";
            $scope.billDetails(item);
        }   
    
    });


/*
window.onload = function def(){
    $.ajax ({url: "http://localhost/CongressSearch/congress-api.php",
            data: {database: 'Legislators', filter: 'state'},
            type: 'GET',
            dataType: 'json',
            success: function(response){  
                
            dispLegislatorsTab("state");
            dispLegislators(response, "state");
                
            } });
}; */

        function dispLegislatorsTab(filter){
            
            var displayTable = "<h3>Legislators</h3><hr style='width:100%; border-color:gainsboro'><div class='subCont'><ul class='nav nav-tabs' style='margin-top:0'><li class='active'><a href='#' id='state' data-toggle='tab' onclick='dispTabs(this.id)'>By State</a></li><li><a href='#' id='house' data-toggle='tab' onclick='dispTabs(this.id)'>House</a></li><li><a href='#' id='senate' data-toggle='tab' onclick='dispTabs(this.id)'>Senate</a></li></ul><div class='tabCont' id='tabContents'>";
            
            if(filter == "state"){
            displayTable += '<div id="welldiv"><div class="well well-sm">Legislators By State<div class="form-group"><select class="form-control input-sm" onchange="dispState(this.value)"><option selected disabled>All States</option><option value="AL">Alabama</option><option value="AK">Alaska</option><option value="AZ">Arizona</option><option value="AR">Arkansas</option><option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DE">Delaware</option><option value="DC">District Of Columbia</option><option value="FL">Florida</option><option value="GA">Georgia</option><option value="HI">Hawaii</option><option value="ID">Idaho</option><option value="IL">Illinois</option><option value="IN">Indiana</option><option value="IA">Iowa</option><option value="KS">Kansas</option><option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="ME">Maine</option><option value="MD">Maryland</option><option value="MA">Massachusetts</option><option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MS">Mississippi</option><option value="MO">Missouri</option><option value="MT">Montana</option><option value="NE">Nebraska</option><option value="NV">Nevada</option><option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NY">New York</option><option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option><option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option><option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TX">Texas</option><option value="UT">Utah</option><option value="VT">Vermont</option><option value="VA">Virginia</option><option value="WA">Washington</option><option value="WV">West Virginia</option><option value="WI">Wisconsin</option><option value="WY">Wyoming</option></select></div></div></div>';
            }
                else if (filter == "house"){
                    displayTable += '<div class="well well-sm">Legislators By House<div class="form-group"><input type="text" class="form-control input-sm" placeholder="Search" onKeydown=”Javascript: if(event.keyCode==13) dispSearch(this.value);”></div></div>';
                }
                else if (filter == "senate"){
                    displayTable += '<div class="well well-sm">Legislators By Senate<div class="form-group"><input type="text" class="form-control input-sm" placeholder="Search"></div></div>';
                }
            
            displayTable += "<div class='tab' id='tab'></div></div></div>";
            
            document.getElementById("display").innerHTML = displayTable;
                
        }
            

        function dispTabs(id){
                if(id == 'house'){
                    
               var newHead = '<div class="well well-sm">Legislators By House<div class="form-group"><input type="text" class="form-control input-sm" placeholder="Search"></div></div>';
                    
                document.getElementById("welldiv").innerHTML = newHead;
            }
            
            else if(id == 'senate'){
                
                
                var newHead = '<div class="well well-sm">Legislators By Senate<div class="form-group"><input type="text" class="form-control input-sm" placeholder="Search"></div></div>';
                    
                document.getElementById("welldiv").innerHTML = newHead;
            }
            
            else if(id == 'state'){
            
                var newHead = '<div class="well well-sm">Legislators By State<div class="form-group"><select class="form-control input-sm" onchange="dispState(this.value)"><option selected disabled>All States</option><option value="AL">Alabama</option><option value="AK">Alaska</option><option value="AZ">Arizona</option><option value="AR">Arkansas</option><option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DE">Delaware</option><option value="DC">District Of Columbia</option><option value="FL">Florida</option><option value="GA">Georgia</option><option value="HI">Hawaii</option><option value="ID">Idaho</option><option value="IL">Illinois</option><option value="IN">Indiana</option><option value="IA">Iowa</option><option value="KS">Kansas</option><option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="ME">Maine</option><option value="MD">Maryland</option><option value="MA">Massachusetts</option><option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MS">Mississippi</option><option value="MO">Missouri</option><option value="MT">Montana</option><option value="NE">Nebraska</option><option value="NV">Nevada</option><option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NY">New York</option><option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option><option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option><option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TX">Texas</option><option value="UT">Utah</option><option value="VT">Vermont</option><option value="VA">Virginia</option><option value="WA">Washington</option><option value="WV">West Virginia</option><option value="WI">Wisconsin</option><option value="WY">Wyoming</option></select></div></div>';
            
                document.getElementById("welldiv").innerHTML = newHead;
                
            }
            $.ajax ({url: "http://localhost/CongressSearch/congress-api.php",
            data: {database: 'Legislators', filter: id},
            type: 'GET',
            dataType: 'json',
            success: function(response){  
               // dispLegislators(response, id);
                } }); 
                
            }
            
        function dispState(st){
            $.ajax ({url: "http://localhost/CongressSearch/congress-api.php",
            data: {database: 'Legislators', state: st},
            type: 'GET',
            dataType: 'json',
            success: function(response){  
                dispLegislators(response, "state");
                } });
        }

        function dispSearch(value){
            
            alert(value);
            
        }
            
        
            function dispLegislators(response, filter){
                
            var result = JSON.parse(response);
            
            var displayTable = "";
                
            displayTable += '<table class="table table-hover table-responsive" data-sort-name="state" data-sort-order="desc"><tr><th>Party</th><th>Name</th><th>Chamber</th><th>District</th><th>State</th><th></th></tr>';
                
            for(var i in result.results){
                var item = result.results[i];
                displayTable += "<tr>";
                if(item.party == "D"){
                    displayTable += '<td class="col-md-2"><img class="img-responsive" height=10% width=10% src="http://cs-server.usc.edu:45678/hw/hw8/images/d.png"></td>';
                }
                else{
                    displayTable += '<td class="col-md-2"><img class="img-responsive" height=10% width=10% src="http://cs-server.usc.edu:45678/hw/hw8/images/r.png"></td>';
                }
                var fname = item.first_name;
                var lname = item.last_name;
                displayTable += "<td class='col-md-2'>"+lname+ ", "+fname+"</td>";
                var ch = item.chamber;
                if(ch == "house"){
                    ch = "House";
                    displayTable += '<td class="col-md-2"><img style="display:inline-block" class="img-responsive" height=10% width=10% src="http://cs-server.usc.edu:45678/hw/hw8/images/h.png"> '+ch+'</td>';
                }
                else{
                    ch = "Senate";
                    displayTable += '<td class="col-md-2"><img style="display:inline-block" class="img-responsive" height=10% width=10% src="http://cs-server.usc.edu:45678/hw/hw8/images/s.svg"> '+ch+'</td>';
                }
                var dist = item.district;
                if(dist == null){
                    var dist = "NA";
                }
                else{
                    var dist = "District "+dist;
                }
                displayTable += "<td class='col-md-2'>"+dist+"</td>";
                var state = item.state_name;
                displayTable += "<td data-field='state' class='col-md-2'>"+state+"</td>";
                displayTable += "<td><input class='btn btn-primary' value='View Details'></td>";
                displayTable += "</tr>";
            }
                
            displayTable += "</table>";
                
            document.getElementById("tab").innerHTML = displayTable;
                

            }

            
