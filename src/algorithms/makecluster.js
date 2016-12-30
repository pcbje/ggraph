var makecluster = (function() {
  var clusters;
  var edges;
  var reverse_index;
  var clusterIndex;

  var _combineClusters = function(source, target) {
     adopting_cluster = reverse_index[source];
     purge_cluster = reverse_index[target];

     if (adopting_cluster === purge_cluster) {
       // Source and target are already in the same cluster. Do nothing
       return
     }

     // Merge the two clusters into a single cluster
     for (var index=0; index<clusters[purge_cluster].length; index++) {
       member = clusters[purge_cluster][index];
       clusters[adopting_cluster].push(member);
       reverse_index[member] = adopting_cluster;
     }

     delete clusters[purge_cluster];
   }

   var _adoptProbe = function(adopter, probe) {
     adopting_cluster = reverse_index[adopter];
     clusters[adopting_cluster].push(probe);
     reverse_index[probe] = adopting_cluster;
   }

   var _createCluster = function(members) {
     clusters[clusterIndex] = members;

     members.map(function(member) {
       reverse_index[member] = clusterIndex
     })

     clusterIndex++;
   }

  var add_pair = function(source, target) {
    if (!(source in edges)) {
      edges[source] = {};
    }

    if (!(target in edges)) {
      edges[target] = {};
    }

    edges[source][target] = true;
    edges[target][source] = true;

    if (source in reverse_index && target in reverse_index) {
      // Both source and target already added. Combine their clusters if necessary.
      _combineClusters(source, target)
    }
    else if (source in reverse_index && !(target in reverse_index)) {
      // Source exists in a cluster, target is new. Add target to source cluster
      _adoptProbe(source, target)
    }
    else if (!(source in reverse_index) && target in reverse_index) {
      // Target exists in a cluster, source is new. Add source to target cluster
      _adoptProbe(target, source)
    }
    else {
      // Neither source nor target exists in a cluster, create a new cluster
      _createCluster([source, target])
    }
  }

  this.from_links = function(_links) {
    clusters = {};
    edges = {};
    reverse_index = {};
    clusterIndex = 0;
    var cache = {};

    _links.map(function(link) {
      if (!link.source || !link.target) {
        throw 'link must contain source and target properties';
      }

      cache[link.source.id] = link.source;
      cache[link.target.id] = link.target;

      add_pair(link.source.id, link.target.id);
    });

    for (var cid in clusters) {
      clusters[cid].map(function(member_id, i) {
        clusters[cid][i] = cache[member_id];
      })
    };

    return clusters;
  }

  return this
})();
