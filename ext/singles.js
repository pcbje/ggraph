'use strict';

var singles = (function() {
  var get_groups = function(graph) {
    var _groups = [];

    var cache = {};

    graph.links.map(function(link) {
      if (!(link.source.id in cache)) cache[link.source.id] = {};
      if (!(link.target.id in cache)) cache[link.target.id] = {};
      cache[link.source.id][link.target.id] = true;
      cache[link.target.id][link.source.id] = true;
    });

    var group_cache = {}

    var keys;
    for (var node in cache) {
      keys = Object.keys(cache[node]);
      if (keys.length === 1) {
        if (!(keys[0] in group_cache)) group_cache[keys[0]] = [];
        group_cache[keys[0]].push(graph.member_map[node]);
      }
    }

    for (var key in group_cache) {
      _groups.push(group_cache[key]);
    }

    return _groups;
  };

  return {
    get_groups: get_groups
  };
})();
