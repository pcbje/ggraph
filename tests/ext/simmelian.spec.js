describe("simmelian backbones", function() {

  it("compute tie strength", function() {
    var all_links = {
      a : { b : 1, c : 1 },
      b : { a : 1, c : 2 },
      c : { a : 1, b : 2, d: 1 },
      d : { c : 1 }
    };

    var tie_strengths = simmelian.compute_tie_strength(all_links);
    var expected = {
      a : { b : 0, c : 1 },
      b : { a : 0, c : 1 },
      c : { a : 0, b : 1, d : 2 },
      d : { c : 0 }
    };

    expect(tie_strengths).toEqual(expected);
  });

  it("compute structural embeddedness", function() {
    var tie_strengths = {
      a : { b : 0, c : 1 },
      b : { a : 0, c : 1 },
      c : { a : 0, b : 1, d : 2 },
      d : { c : 0 }
    };

    var a_b = simmelian.structural_embeddedness(
      tie_strengths, 'a', 'b');

    var a_c = simmelian.structural_embeddedness(
      tie_strengths, 'a', 'c');

    var expected = []

    expect(a_b).toEqual(1);
    expect(a_c).toEqual(0.75);
  });

  it("compute backbones", function() {
    var all_links = {
      a : { b : 1, c : 1 },
      b : { a : 1, c : 2 },
      c : { a : 1, b : 2, d: 1 },
      d : { c : 1 }
    };

    var backbones = simmelian.filter(all_links);    
  });
});
