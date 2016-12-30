var merger = (function() {
  return {
    merge: function(graph, selected) {
      var merged_graph = {
        nodes: [],
        links: [],
        all_links: graph.all_links,
        member_map: graph.member_map,
        group_map: {}
      };
      var merge = {};

      var remove = [];
      var x = 0, y = 0;

      var group_cache = {};
      var merged_group_cache = {};
      var group;

      if (selected.length< 2) selected;
      var new_members = [];

      var merged_group = {
        id: '',
        members: new_members,
        x: 0,
        y: 0,
      };

      var local_groups = {}

      selected.map(function(node) {
        var nid = node.id ? node.id : node;
        var group_id = graph.member_map[nid].group;

        if (!(group_id in group_cache)) {
          group_cache[group_id] = true;
          local_groups[group_id] = true;

          if (merged_group.id.length > 0) {
              merged_group.id += "-";
          }

          merged_group.id += group_id;

          merge[group_id] = merged_group;

          var group = graph.nodes[graph.group_map[group_id]];

          // Group created as part of this merge.
          if (!group) {
            group = merged_graph.nodes[merged_graph.group_map[group_id]];
          }

          merged_group.x += group.x;
          merged_group.y += group.y;

          group.members.map(function(member) {
            new_members.push(member);
          });
        }
      });

      merged_group.x /= Object.keys(local_groups).length;
      merged_group.y /= Object.keys(local_groups).length;

      merged_graph.all_links[merged_group.id] = {};

      new_members.map(function(member) {
        merged_graph.member_map[member.id].group = merged_group.id;
        graph.member_map[member.id].group = merged_group.id
      });

      merged_group_cache[merged_group.id] = merged_group;

      merged_graph.group_map[merged_group.id] = merged_graph.nodes.length;
      merged_graph.nodes.push(merged_group);


      graph.nodes.map(function(group) {
        if (!(group.id in merge)) {
          merged_graph.group_map[group.id] = merged_graph.nodes.length;
          merged_graph.nodes.push(group);
        }
      });

      graph.links.map(function(link) {
        if (!link.source.id) link.source = {id: link.source}
        if (!link.target.id) link.target = {id: link.target}

        // Link not changed.
        if (link.source.id in merge && link.target.id in merge) { return; }

        if (link.source.id in merge && merged_group_cache[merge[link.source.id].id]) {
          link.source = merged_group_cache[merge[link.source.id].id];
        }

        if (link.target.id in merge && merged_group_cache[merge[link.target.id].id]) {
          link.target = merged_group_cache[merge[link.target.id].id];
        }

        if (link.source.id !== link.target.id) {
          merged_graph.all_links[link.source.id][link.target.id] = true;
          merged_graph.all_links[link.target.id][link.source.id] = true;
        }

        merged_graph.links.push({
          source: link.source.id,
          target: link.target.id
        });
      });

      return merged_graph;
    }
  }
})();
