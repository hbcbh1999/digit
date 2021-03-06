function connect(name) {
    var socket = new WebSocket(document.location.origin.replace(/^http/, "ws") + "/ws?name=" + name)
    socket.onopen = function() {
        var repoViewer = new RepoViewer();
        repoViewer.render(d3.select("#" + name));
        var firstUpdate = true;
        socket.onmessage = function(evt) {
            repoViewer.update(JSON.parse(evt.data), firstUpdate);
            firstUpdate = false;
        };
    };
    socket.onerror = function() {
        socket.close();
    }
    socket.onclose = function(evt) {
        console.log("ws connection closed with code '" + evt.code + "' and reason '" + evt.reason + "' (clean='" + evt.wasClean + "')");
        setTimeout(connect.bind(null, name), 2000);
    }
};
names.forEach(connect);
