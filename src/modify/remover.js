var remover = (function() {
  return {
    remove: function(graph, selected_groups) {
      var modified_graph = {
        nodes: [],
        links: [],
        all_links: graph.all_links,
        group_map: {},
        member_map: graph.member_map
      };
      var members_to_remove = {}

      selected_groups.map(function(group) {
        group.map(function(member) {
          members_to_remove[member.id] = true;
        });
      });

      graph.nodes.map(function(group) {
        var existing_members = group.members;
        group.members = [];

        existing_members.map(function(member) {
          if (member.id in members_to_remove) {
            delete modified_graph.all_links[member.id];
            delete modified_graph.member_map[member.id];
          }
          else {
            group.members.push(member);
          }
        });

        if (group.members.length > 0) {
          modified_graph.group_map[group.id] = modified_graph.nodes.length;
          modified_graph.nodes.push(group);
        }
      });

      graph.links.map(function(link) {
        if (link.source.id in modified_graph.group_map && link.target.id in modified_graph.group_map) {
          modified_graph.links.push(link)
        }
        else {
          // we don't know/case if the links are registered reflexively.
          try {
            delete modified_graph.all_links[link.source.id][link.target.id];
          } catch (e) {}
          try {
            delete modified_graph.all_links[link.target.id][link.source.id];
          } catch (e) {}
        }
      });

      return modified_graph;
    }
  }
})();
