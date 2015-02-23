'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFullstackApp'));
  beforeEach(module('socketMock'));

  var $rootScope,
      $httpBackend,
      createController;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    /* Mimic backend */
    $httpBackend.when('GET', '/api/things')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    // OLD IMPLEMENTATION
    // scope = $rootScope.$new();
    // MainCtrl = $controller('MainCtrl', {
    //   $scope: scope
    // });

    $rootScope = $injector.get('$rootScope');
    var $controller = $injector.get('$controller');

    createController = function() {
      return $controller('MainCtrl', {'$scope' : $rootScope});
    };
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should attach a list of things to the scope', function () {
    $httpBackend.expectGET('/api/things');

    var controller = createController();
    $httpBackend.flush();
    expect($rootScope.awesomeThings.length).toBe(4);
  });

  describe('$scope.addThing', function () {
    it('should make request to API', function () {
      var controller = createController();
      $httpBackend.flush();
    
      var thingName = 'something new';
      $httpBackend.expectPOST('/api/things', { name: thingName }).respond(200);
      $rootScope.newThing = thingName;
      $rootScope.addThing();
      $httpBackend.flush();
    });
  });

  describe('$scope.deleteThing', function () {
    it('should make request to API', function () {
      var controller = createController();
      $httpBackend.flush();
    
      var thingId = $rootScope.awesomeThings[2];
      $httpBackend.expectDELETE('/api/things/' + thingId._id).respond(200);
      $rootScope.deleteThing(thingId);
      $httpBackend.flush();
    });
  });

});
