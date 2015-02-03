  (function(){

    var state = document.readyState;
    if(state !== 'interactive' && state !== 'complete') {
      setTimeout(arguments.callee, 100);
      return;
    }

    if (typeof WebSocket === undefined){
      console.log('grunt-browser-output - websockets not available');
      return;
    }

    var connection = new WebSocket('ws://localhost:37901');
    connection.onmessage = function(e){
      var data = JSON.parse(e.data);
      var pre = document.querySelector('#grunt-browser-output>pre');
      if (data.line) {
        $('#grunt-browser-output>pre').append(data.line);
        pre.scrollTop = pre.scrollHeight;
      }
      if (data.removeLine) {
        pre.removeChild(pre.children[pre.children.length-1]);
      }
      if (data.isError) {
        document.querySelector('#grunt-browser-output').style.display = 'block';
      }

      while (pre.children.length > 300) {
        pre.removeChild(pre.children[0]);
      }
      //need to delete the lines over time else the browser will get bogged down
    };

    var elem = document.createElement('div');
    elem.id = 'grunt-browser-output';
    elem.style.display = 'none';
    elem.style.position = 'fixed';
    elem.style.top = elem.style.left = elem.style.bottom = elem.style.right = '10px';
    elem.style.paddingTop = '0px';
    elem.style.zIndex = 9999999;

    var pre = document.createElement('pre');
    pre.style.backgroundColor = 'black';
    pre.style.color = '#CCC';
    pre.style.position = 'absolute';
    pre.style.top = pre.style.left = pre.style.bottom = pre.style.right = '0px';
    pre.style.overflowY = 'scroll';
    pre.style.marginBottom = '0px';
    elem.appendChild(pre);

    var toolbar = document.createElement('div');
    toolbar.style.position = 'absolute';
    toolbar.style.top = '5px';
    toolbar.style.right = '25px';
    toolbar.style.zIndex = 999999;
    elem.appendChild(toolbar);

    var link = document.createElement('a');
    link.style.color = 'grey';
    link.href = 'http://github.com/cgross/grunt-browser-output';
    link.innerHTML = 'grunt-browser-output';
    toolbar.appendChild(link);

    var sep = document.createElement('span');
    sep.innerHTML = ' | ';
    toolbar.appendChild(sep);

    link = document.createElement('a');
    link.style.color = 'grey';
    link.href = '#';
    link.innerHTML = 'clear';
    link.addEventListener('click',function(e){
      e.preventDefault();
      pre.innerHTML = '';
    });
    toolbar.appendChild(link);

    sep = document.createElement('span');
    sep.innerHTML = ' | ';
    toolbar.appendChild(sep);

    link = document.createElement('a');
    link.style.color = 'grey';
    link.href = '#';
    link.innerHTML = 'close';
    link.addEventListener('click',function(e){
      e.preventDefault();
      elem.style.display = 'none';
    });
    toolbar.appendChild(link);

    document.body.appendChild(elem);

})();
