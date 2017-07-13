 <?php
if(isset($_GET['database']) && $_GET['database'] == "Legislators"){
    $url = "http://congress.api.sunlightfoundation.com/legislators?per_page=all&order=state_name__asc,last_name__asc&apikey=901c5478ca1f46d8a4dd40c9423f1e78";
    $url1 = "http://104.198.0.197:8080/legislators?per_page=all&order=state_name__asc,last_name__asc&apikey=901c5478ca1f46d8a4dd40c9423f1e78";
    }

    else if(isset($_GET['database']) && $_GET['database'] == "Bills"){
        
        if($_GET['status'] == "Active Bills"){
        $url = "http://congress.api.sunlightfoundation.com/bills?apikey=901c5478ca1f46d8a4dd40c9423f1e78&per_page=50&history.active=true";
        $url1 = "http://104.198.0.197:8080/bills?apikey=901c5478ca1f46d8a4dd40c9423f1e78&per_page=50&history.active=true";
        }
        
        else if($_GET['status'] == "New Bills"){
        $url = "http://congress.api.sunlightfoundation.com/bills?apikey=901c5478ca1f46d8a4dd40c9423f1e78&per_page=50&history.active=false";
        $url1 = "http://104.198.0.197:8080/bills?apikey=901c5478ca1f46d8a4dd40c9423f1e78&per_page=50&history.active=false";
        }
        
        else if(isset($_GET['filter'])){
            $filter = $_GET['filter'];
            $url = "http://congress.api.sunlightfoundation.com/bills?sponsor.bioguide_id=$filter&apikey=901c5478ca1f46d8a4dd40c9423f1e78&per_page=5";
            $url1 = "http://104.198.0.197:8080/bills?sponsor.bioguide_id=$filter&apikey=901c5478ca1f46d8a4dd40c9423f1e78&per_page=5";
        }
    }

else if(isset($_GET['database']) && $_GET['database'] == "Committees"){
   
    if(isset($_GET['filter'])){
        $filter = $_GET['filter'];
        $url = "http://congress.api.sunlightfoundation.com/committees?member_ids=$filter&apikey=901c5478ca1f46d8a4dd40c9423f1e78&per_page=5";
        $url1 = "http://104.198.0.197:8080/committees?member_ids=$filter&apikey=901c5478ca1f46d8a4dd40c9423f1e78&per_page=5";
    }
        
    
   else{
    
   $url = "http://congress.api.sunlightfoundation.com/committees?apikey=901c5478ca1f46d8a4dd40c9423f1e78&per_page=all";
       $url1 = "http://104.198.0.197:8080/committees?apikey=901c5478ca1f46d8a4dd40c9423f1e78&per_page=all";
   }
    
}
$json = @file_get_contents($url);


if($json === FALSE || $json === false){
    $json = file_get_contents($url1);
}
//header("Access-Control-Allow-Origin: *");
echo json_encode($json);
?>
