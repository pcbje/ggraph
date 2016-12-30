var simmelian = (function() {
  this.compute_tie_strength = function(all_links) {
    var tie_strengths = {};

    for (var member in all_links) {
      var strengths = []

      var a = Object.keys(all_links[member]);

      for (var contact in all_links[member]) {
        var b = Object.keys(all_links[contact]);

        var a_strength = 0;
        var b_strength = 0;

        a.map(function(x) {
          if (x in all_links[contact]) {
            a_strength++;
          }
        });

        b.map(function(z) {
          if (z in all_links[member]) {
            b_strength++;
          }
        });

        var strength = Math.max(1, a_strength, b_strength) / Math.max(a.length - 1, b.length - 1);

        strengths.push({member: contact, strength: strength});
      }

      strengths.sort(function(a, b) {
        return b.strength - a.strength;
      });

      tie_strengths[member] = {};

      strengths.map(function(c, i) {
        tie_strengths[member][c.member] = i;
      })
    }

    return tie_strengths;
  }

  this.structural_embeddedness = function(strengths, a, b) {
    var a_length = Object.keys(strengths[a]).length;

    var embeddedness = a_length;

    for (var c in strengths[a]) {
      if (c === b) continue;

      if (c in strengths[b]) {
        x = strengths[a][c];
        y = strengths[b][c];
        embeddedness -= Math.abs(x - y) / a_length;
      }
      else {
        embeddedness -= 1;
      }
    }

    return embeddedness / a_length;
  }

  this.filter = function(all_links, threshold) {
    var tie_strengths = this.compute_tie_strength(all_links);
    var filtered = {};
    var s;

    for (var a in all_links) {
      filtered[a] = {}
      for (var b in all_links[a]) {
        s = this.structural_embeddedness(tie_strengths, a, b);

        if (s < threshold) {
          filtered[a][b] = s;
        }
      }
    }

    return filtered;
  }

  return this;
})();
