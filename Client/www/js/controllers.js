angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, steamService) {

    $scope.intodate = function(int){
      var myObj = $.parseJSON('{"date_created":"'+int+'"}'),
      myDate = new Date(1000*myObj.date_created);

      return myDate.toLocaleDateString();
    }

    $scope.getFriends = function(){
      let steamID = $('#steamID').val();

      steamService.getFriendList(steamID)
        .then(function(friends){
          $scope.friends = friends.friendslist.friends
      });
    };
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
