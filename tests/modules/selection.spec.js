describe("modules", function() {

  it("handles selection", function() {
    selection.clear();
    
    expect(selection.size()).toEqual(0);

    var calls = 0;
    selection.listen(function() {
      calls++;
    });

    selection.add({id: 'abc', type: 'x'})
    selection.add({id: 'def', type: 'x'})
    selection.add({id: 'xyz', type: 'x'}, 'mock')

    expect(selection.size()).toEqual(3);
    expect(calls).toEqual(3);

    expect(selection.selected()).toEqual({
      abc: {id: 'abc', type: 'x'},
      def: {id: 'def', type: 'x'}
    });

    expect(selection.all()).toEqual([
      {id: 'abc', type: 'x'},
      {id: 'def', type: 'x'},
      {id: 'xyz', type: 'x'}
    ]);

    expect(selection.is_selected({id: 'abc'})).toEqual(true);
    expect(selection.is_selected({id: '123'})).toEqual(false);

    selection.clear();

    expect(selection.size()).toEqual(0);
    expect(calls).toEqual(4);
  });
});
