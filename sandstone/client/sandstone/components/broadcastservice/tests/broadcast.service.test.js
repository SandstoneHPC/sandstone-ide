describe('BroadcastService', function() {
  beforeEach(module('sandstone'));
  beforeEach(module('sandstone.websocketservice'));
  beforeEach(module('sandstone.broadcastservice'));

  var BroadcastService, mockWebsocketService;

  beforeEach(module(function($provide) {
    var mockConnection = jasmine.createSpyObj(
      'ws',
      ['send']
    );
    mockWebsocketService = {
      connect: function(url) {
        return mockConnection;
      }
    };
    $provide.value('WebsocketService',mockWebsocketService);
    spyOn(WebsocketService,'connect').andCallThrough();
  }));
  beforeEach(inject(function(_BroadcastService_) {
    BroadcastService = _BroadcastService_;
  }));

  it('should establish a websocket connection when loaded.', function() {
    expect(WebsocketService.connect).toHaveBeenCalled();
  });
});
