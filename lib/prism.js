AFRAME.registerGeometry('prism', {
  schema: {
    floor: {default: 0},
    height: {default: 1},
    vertices: {
      default: '0 0, 0.1 0, 0 0.1',
      parse: function (str) {
        console.log('parse');
        var arr = str.split(', ');
        var res = arr.map(function (value) {
          var [x, y] = value.split(' ');
          return new THREE.Vector2(x, y);
        });
        console.log(res);
        return res;
      },
      stringify: function(arr) {
        console.log('stringify');
        return arr.map(function (value) {
          return value.x + ' ' + value.y;
        }).join(', ');
      }
    },
  },

  init: function (data) {
    console.log('hi');
    console.log(this);

    // Prepare vertices
    vertices = data.vertices;
    var lastVertex = vertices[vertices.length - 1];
    var lowerLeft = vertices.reduce(function (acc, cur) {
      acc.x = Math.min(acc.x, cur.x);
      acc.y = Math.min(acc.y, -cur.y);
      return acc;
    }, new THREE.Vector2(0, 0));
    
    // Create closed shape by starting and ending at last vertex
    var shape = new THREE.Shape();
    shape.moveTo(lastVertex.x - lowerLeft.x, -lastVertex.y - lowerLeft.y);
    for (const vertex of vertices) {
      shape.lineTo(vertex.x - lowerLeft.x, -vertex.y - lowerLeft.y);
    }
    
    // Create geometry by extrusion
    console.log('uvGenerator');
    console.log(this.uvGenerator);
    this.geometry = new THREE.ExtrudeGeometry(shape, {
      curveSegments: 1,
      amount: data.height,  // deprecated in later version, depth used instead
      depth: data.height,
      bevelEnabled: false,
      UVGenerator: this.uvGenerator,
    });
    this.geometry.translate(lowerLeft.x, lowerLeft.y, data.floor);
    this.geometry.rotateX(-Math.PI / 2);

    // Finalize geometry
    this.geometry.computeBoundingBox();
    this.geometry.mergeVertices();
    console.log('done');
    console.log(this.geometry);

    /*
    // Create material and mesh
    this.material = new THREE.MeshStandardMaterial();
    this.material.side = THREE.DoubleSide;
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.el.setObject3D('mesh', this.mesh);
    */
  },
  
  uvGenerator: {
    generateTopUV: function (geometry, vertices, indexA, indexB, indexC) {
      console.log(geometry, vertices, indexA, indexB, indexC);

      var a_x = vertices[indexA * 3];
      var a_y = vertices[indexA * 3 + 1];
      var b_x = vertices[indexB * 3];
      var b_y = vertices[indexB * 3 + 1];
      var c_x = vertices[indexC * 3];
      var c_y = vertices[indexC * 3 + 1];
      a_x = a_y = b_x = b_y = c_x = c_y = 0;

      return [
	new THREE.Vector2(a_x, a_y),
	new THREE.Vector2(b_x, b_y),
	new THREE.Vector2(c_x, c_y),
      ];
    },

    generateSideWallUV: function (geometry, vertices, indexA, indexB, indexC, indexD) {
      var a_x = vertices[ indexA * 3 ];
      var a_y = vertices[ indexA * 3 + 1 ];
      var a_z = vertices[ indexA * 3 + 2 ];
      var b_x = vertices[ indexB * 3 ];
      var b_y = vertices[ indexB * 3 + 1 ];
      var b_z = vertices[ indexB * 3 + 2 ];
      var c_x = vertices[ indexC * 3 ];
      var c_y = vertices[ indexC * 3 + 1 ];
      var c_z = vertices[ indexC * 3 + 2 ];
      var d_x = vertices[ indexD * 3 ];
      var d_y = vertices[ indexD * 3 + 1 ];
      var d_z = vertices[ indexD * 3 + 2 ];

      var ab = Math.hypot(b_x - a_x, b_y - a_y);
      var cd = Math.hypot(d_x - c_x, d_y - c_y);

      return [
        new THREE.Vector2(-0.5 * ab, 1 - a_z),
        new THREE.Vector2( 0.5 * ab, 1 - b_z),
        new THREE.Vector2( 0.5 * cd, 1 - c_z),
        new THREE.Vector2(-0.5 * cd, 1 - d_z),
      ];
    },
  },
});
