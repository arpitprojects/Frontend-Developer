radioOn.config(['$qProvider', function($qProvider){
   $qProvider.errorOnUnhandledRejections(false);

}]);
radioOn.controller('homeController' , ['$scope','$http' ,'$sce', function($scope , $http , $sce){
    $scope.playlist_item = [];
    var count =0;
    var current_player;
    var self = this;
    var i , url , videoid;
    var tempo_obj = {};
    var new_obj = {};
    var obj_temp = {};
    var final_timer = 0;
    var temp_obj = {};
    var temporary_obj = {};
    var hold;
    $scope.remove = function(overdata){
        $http.post('https://playlist-royletzchange.rhcloud.com/remove/'+overdata).then(function(data){
            console.log(data.data);
            $('.modal1').modal('close');
            location.reload();
        } , function(data){
            console.log(data.data) 
        });
    }
    $scope.addToCurrentPlaylist = function(new_data){
        $('.modal1').modal('open');
        console.log(new_data);

        $http.get('https://playlist-royletzchange.rhcloud.com/list').then(function(data){

            var leng = data.data.data.length;
            for(i=0;i<leng;i++){
                if(new_data === data.data.data[i]._id){
                    //console.log('Match Found');
                    hold = i;
                }
            }
            $scope.current_playlist = data.data.data[hold];
            $scope.remove_id = data.data.data[hold].id;
            $scope.embed_new_url = 'https://www.youtube.com/embed/'+$scope.current_playlist.id+'?autoplay=1';
            //Execute a js function after the timer 

            var timer_to_close = data.data.data[hold].duration;
            var timer_to_close = timer_to_close + "000";
            timer_to_close = parseInt(timer_to_close);
            console.log(timer_to_close);
            setTimeout(function(){
                $http.post('https://playlist-royletzchange.rhcloud.com/remove/'+$scope.remove_id).then(function(data){
                    console.log(data.data);
                    $('.modal1').modal('close');
                    setTimeout(function(){
                        location.reload();    
                    } , 1000);
                    
                } , function(data){
                    console.log(data.data) 
                });
            } , timer_to_close);


        } , function(data){

        });   
    }
    $scope.addsong = function(x){

        var duration_response;

        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        var checking = x.match(p);

        if(checking){

            $http.get('http://www.youtube.com/oembed?url='+x+'&format=json').then(function(data){
                count = count+1;
                var temp_html = $sce.trustAsHtml(data.data.html);
                temp_obj = {
                    'id' : count,
                    'title' : data.data.title,
                    'html' : temp_html,
                    'thumb_url' : data.data.thumbnail_url,
                    'author_name' : data.data.author_name,
                    'author_url' : data.data.author_url,
                    'url' : x,
                    'video_id' : checking[1],
                    'embed_url' : 'https://www.youtube.com/embed/'+checking[1]+'?feature=oembed'

                };

                // Using YQL and JSONP
                $.ajax({
                    url: 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id='+checking[1]+'&key=AIzaSyC8FVshAIjNhVRfq2zVB7TSm0NuDCoRems',

                    // The name of the callback parameter, as specified by the YQL service
                    jsonp: "callback",

                    // Tell jQuery we're expecting JSONP
                    dataType: "jsonp",

                    // Tell YQL what we want and that we want JSON


                    // Work with the response
                    success: function( response ) {
                        duration_response =  response.items[0].contentDetails.duration; 
                        // server response
                        var get = convert_time(duration_response);

                        var str = get.split(":");

                        final_timer = parseInt(str[0]) * 60 + parseInt(str[1]);

                        new_obj = {
                            "data" :  {
                                'title' : data.data.title,
                                'id' : checking[1],
                                'duration' : final_timer
                            }
                        }


                        $http.post('https://playlist-royletzchange.rhcloud.com/add' , new_obj).then(function(data){


                            console.log(new_obj);

                            var tempor_url = "https://www.youtube.com/watch?v="+ new_obj.data.id;
                            $http.get('http://www.youtube.com/oembed?url='+tempor_url+'&format=json').then(function(data){

                                tempo_obj = data.data;
                                //console.log(tempo_obj);
                                count = count + 1;

                                $scope.playlist_item.push({
                                    'id' : new_obj.data._id,
                                    'title' : tempo_obj.title,
                                    'html' : tempo_obj.html,
                                    'thumb_url' : tempo_obj.thumbnail_url,
                                    'author_name' : tempo_obj.author_name,
                                    'author_url' : tempo_obj.author_url,
                                    'url' : url,
                                    'video_id' : new_obj.data.id,
                                    'embed_url' : 'https://www.youtube.com/embed/'+new_obj.data.id+'?feature=oembed'

                                });
                                console.log($scope.playlist_item);
                                $scope.inputurl = "";
                                location.reload();
                            } , function(data){

                                console.error(data.data);

                            });
                        } , function(data){

                            console.log(data.data)

                        });
                    }
                });
            });
        }else{
            alert('Incorrect Url!');
        }
    }



    $http.get('https://playlist-royletzchange.rhcloud.com/list').then(function(data){

        $scope.playlist_arr = data.data.data;

        $scope.playlist_len = (data.data.data).length;

        //console.log($scope.playlist_arr);



        for(i=0;i<$scope.playlist_len;i++){

            url = 'https://www.youtube.com/watch?v='+$scope.playlist_arr[i].id+'&t='+$scope.playlist_arr[i].duration+'s';

            //console.log(url);  

            videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);

            if(videoid != null) {
                //console.log(videoid[1]);
            } else { 
                console.log("The youtube url is not valid.");
            }

            $http.get('http://www.youtube.com/oembed?url='+url+'&format=json').then(function(data){

                temporary_obj = data.data;



            } , function(data){

                console.error(data.data);

            });

            $scope.playlist_item.push({
                'id' : $scope.playlist_arr[i]._id,
                'title' : temporary_obj.title,
                'html' : temporary_obj.html,
                'thumb_url' : temporary_obj.thumbnail_url,
                'author_name' : temporary_obj.author_name,
                'author_url' : temporary_obj.author_url,
                'url' : url,
                'video_id' : videoid[1],
                'embed_url' : 'https://www.youtube.com/embed/'+videoid[1]+'?feature=oembed'

            });

        }
        //console.log($scope.playlist_item);
    } , function(data){
        console.error(data);
    });
}]);

radioOn.controller('playlistController' , ['$scope' , function($scope){
    $scope.title = "Play";
}]);

radioOn.filter('trustUrl' , function($sce){
    return function(url){
        return $sce.trustAsResourceUrl(url);
    }
});
