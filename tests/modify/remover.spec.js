describe("modify", function() {

  it("should remove", function() {
    var graph = {
      nodes: [
        {id: 'a', x: 1, y: 1, members:[{'id': 'a', type:'x'}]},
        {id: 'b', x: 2, y: 2, members:[{'id': 'b', type:'x'}]},
        {id: 'c', x: 3, y: 3, members:[{'id': 'c', type:'x'}]},
        {id: 'z', x: 4, y: 4, members:[{'id': 'd', type:'x'}, {'id': 'e', type:'x'}]}
      ],
      links: [
        {source: {id: 'a'}, target: {id: 'b'}},
        {source: {id: 'a'}, target: {id: 'c'}},
        {source: {id: 'b'}, target: {id: 'c'}}
      ],
      all_links: {
        'a': {'b': true, 'c': true},
        'b': {'a': true, 'c': true},
        'c': {'a': true, 'b': true}
      },
      member_map: {
        'a': {type: 'x', group: 'a'},
        'b': {type: 'x', group: 'b'},
        'c': {type: 'x', group: 'c'},
        'd': {type: 'x', group: 'z'},
        'e': {type: 'x', group: 'z'}
      },
      group_map: {
        'a': 0,
        'b': 1,
        'c': 2,
        'z': 3
      }
    }

    var expected = {
      nodes: [
        {id: 'a', x: 1, y: 1, members:[{'id': 'a', type:'x'}]},
        {id: 'b', x: 2, y: 2, members:[{'id': 'b', type:'x'}]},
        {id: 'z', x: 4, y: 4, members:[{'id': 'e', type:'x'}]}
      ],
      links: [
        {source: {id: 'a'}, target: {id: 'b'}}
      ],
      all_links: {
        'a': {'b': true},
        'b': {'a': true}
      },
      member_map: {
        'a': {type: 'x', group: 'a'},
        'b': {type: 'x', group: 'b'},
        'e': {type: 'x', group: 'z'}
      },
      group_map: {
        'a': 0,
        'b': 1,
        'z': 2
      }
    }

    var selected = [[{id: 'c'}, {id: 'd'}]];

    var removed = remover.remove(graph, selected);

    expect(removed).toEqual(expected);
  });
});
