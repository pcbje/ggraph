describe("algorithms", function() {

  it("makecluster", function() {
    var links = [
        {source: {id: 'a'}, target: {id: 'b'}},
        {source: {id: 'c'}, target: {id: 'd'}},
        {source: {id: 'e'}, target: {id: 'f'}},
        {source: {id: 'b'}, target: {id: 'c'}},
        {source: {id: 'b'}, target: {id: 'g'}},
        {source: {id: 'h'}, target: {id: 'b'}},
    ]

    var expected = {
      0: [{id: 'a'}, {id: 'b'}, {id: 'c'}, {id: 'd'}, {id: 'g'}, {id: 'h'}],
      2: [{id: 'e'}, {id: 'f'}]
    };

    var actual = makecluster.from_links(links);

    expect(actual).toEqual(expected);
  });
});
