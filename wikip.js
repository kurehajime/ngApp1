angular.module('wikip', ['wikipedia_api'])
  .controller('WikipController', ['wp_api','$scope','$timeout', function(wp_api,$scope,$timeout) {
    this.keyword = "AngularJS";
    this.body = "キーワードを入力して表示ボタンを押してください";
    this.go = function go() {
        $scope.wikip.body="loading...";
        wp_api.getPage(this.keyword).then(function(res){
            $timeout(function () {
                if(res===undefined){
                    $scope.wikip.body="Nof found..."
                    return;
                }
                var body="";;
                var exresult=res.match(/'''(.*)/);//最初の紹介文だけ抜き取る。
                if(exresult){
                    body=exresult[0];
                    
                    //コメント削除
                    body=body.replace(/<!--.*?-->/g,'')
                    
                    //読み替えリンク削除 
                    body=body.replace(/\]\]/g,']]\n')
                    body=body.replace(/\[\[.+?\|(.+?)\]\]/g,'$1')
                    body=body.replace(/\n/g,'')
                    
                    //リンク削除
                    body=body.replace(/[\[\]']/g,'')
                    
                    //注釈削除
                    body=body.replace(/<.*?>.*<\/.*?>/g,'')
                    body=body.replace(/<.*?\/>/g,'')

                }
                $scope.wikip.body=body
            },100);
      })
    };
  }]);

angular.module('wikipedia_api', [])
  .factory('wp_api', ['$http', function($http) {
    var WIKIPEDIA_API_URL =
          'https://ja.wikipedia.org/w/api.php?'+
          'format=json&action=query&prop=revisions&rvprop=content&callback=JSON_CALLBACK'+
          '&titles=';
    return {
      getPage: getPage
    };
    function getPage(keyword) {
      var url = WIKIPEDIA_API_URL+keyword;
      return $http.jsonp(url).then(
        function(response) {
            for(var i in response.data['query']['pages']){
                if(i!=-1){
                    return  response.data['query']['pages'][i]['revisions']['0']['*'];
                }
            }
            return undefined;
      },function(response){
            return undefined;
      });
    }
  }]);