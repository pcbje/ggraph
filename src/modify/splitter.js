var splitter = (function() {
  return {
    split: function(graph, selected_groups) {
      var groups_to_split = {};

      if (selected_groups[0].constructor !== Array) {
        selected_groups = [selected_groups];
      }

      selected_groups.map(function(members) {
        members.map(function(member) {
          var mid = member.id ? member.id : member;
          var group = graph.member_map[mid].group;
          if (!(group in groups_to_split)) groups_to_split[group] = {};
          groups_to_split[group][member.id] = true;
        });
      });

      for (var group in groups_to_split) {
        if (Object.keys(groups_to_split[group]).length < 2) {
          delete groups_to_split[group];
        }
      }

      var split_graph = {
        nodes: [],
        links: [],
        all_links: graph.all_links,
        member_map: graph.member_map,
        group_map: {}
      };

      var splitted_groups = {};

      for (var group_id in groups_to_split) {
        splitted_groups[group_id] = true;
        var group_to_split = graph.nodes[graph.group_map[group_id]];

        if (group_to_split.members.length === 1) continue;

        group_to_split.members.map(function(member) {
          var group = {id: member.id, x: group_to_split.x, y: group_to_split.y, members: [member]};
          split_graph.member_map[member.id].group = member.id;
          split_graph.group_map[member.id] = split_graph.nodes.length;
          split_graph.nodes.push(group);
        });

        delete split_graph.all_links[group_id]
      }

      graph.nodes.map(function(group) {
        if (!(group.id in splitted_groups)) {
          split_graph.group_map[group.id] = split_graph.nodes.length;
          split_graph.nodes.push(group);
        }
      });

      split_graph.nodes.map(function(group) {
        group.members.map(function(member) {
          var group = split_graph.member_map[member.id].group;

          for (var other_id in graph.all_links[group]) {
            if (other_id in split_graph.group_map) {
              split_graph.links.push({source: group, target: other_id});
            }
            else {
              delete graph.all_links[member.id][other_id]
            }
          }
        });
      });

      return split_graph;
    }
  }
})();
