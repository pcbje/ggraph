var selection = (function() {
  var listeners = [];
  var all = [];
  var selected = {};
  var map = {}

  var timeout;

  return {
    listen: function(callback) {
      listeners.push(callback);
    },
    notify: function() {
      listeners.map(function(listener) {
        listener();
      });
    },
    size: function() {
      return all.length;
    },
    add: function(node, role) {
      if (!node.id) {
        console.log('invalid node ' + node);
        return;
      }
      if (!role) {
        role = 'selected';
      }
      if (!(node.id in map)) {
        all.push(node);
      }
      map[node.id] = node;
      if (role == 'selected') {
          selected[node.id] = node;
      }
      this.notify();
    },
    is_selected: function(node) {
      return node.id in map;
    },
    clear: function() {
      selected = {};
      all = [];
      map = {};
      this.notify();
    },
    clear_contacts: function() {
      all = [];

      for (var sel in selected) {
        all.push(selected[sel]);
      }

      this.notify();
    },
    selected: function() {
      return selected;
    },
    all: function() {
      return all;
    }
  }
})();
