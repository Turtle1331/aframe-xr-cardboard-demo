AFRAME.registerSystem('boundary', {
  init: function () {
    this.bindMethods();
    
    this.floor = null;
    this.selectedFloor = null;
    this.corners = [];
    this.selectedCorner = null;

    this.el.addEventListener('newanchor', this.newAnchor);

    if (this.el.hasLoaded) {
      this.loaded();
    } else {
      this.el.addEventListener('loaded', this.loaded);
    }
  },

  bindMethods: function () {
    this.loaded = this.loaded.bind(this);
    this.newAnchor = this.newAnchor.bind(this);
    this.addFloor = this.addFloor.bind(this);
    this.addCorner = this.addCorner.bind(this);
    this.removeCorner = this.removeCorner.bind(this);
    this.setSelected = this.setSelected.bind(this);
    this.createWalls = this.createWalls.bind(this);
  },

  loaded: function () {
    this.root = document.createElement('a-entity');
    this.root.id = 'boundary-root';
    this.el.appendChild(this.root);
  },

  newAnchor: function (evt) {
    this.clearSelected();

    var entity = evt.detail.entity;
    if (this.floor == null) {
      entity.setAttribute('mixin', 'boundary-floor');
    } else {
      entity.setAttribute('mixin', 'boundary-corner');
    }
    this.root.appendChild(entity);
  },

  createWalls: function () {
    var vertices = this.corners.map(function (corner) {
      var pos = corner.getAttribute('position');
      return pos.x + ' ' + pos.z;
    }).join(', ');
    //document.querySelector('#alertMessage').innerHTML = vertices;
    document.querySelector('#alertMessage').innerHTML = '';
    
    var height = 2;
    var floor = this.floor.getAttribute('position').y;
    var entity = document.createElement('a-entity');
    this.root.appendChild(entity);
    entity.setAttribute('geometry', {
      floor: floor,
      height: height,
      vertices: vertices,
    });
    entity.setAttribute('boundary_walls', {
      vertices: vertices,
    });
    entity.setAttribute('mixin', 'boundary-walls');

    // Show the sky (hide the AR pass-through)
    document.querySelector('#sky').setAttribute('visible', true);

    // Create a new floor entity as a root for future content
    var ground = document.createElement('a-entity');
    ground.setAttribute('position', this.floor.getAttribute('position'));

    // Remove the others
    this.floor.parentNode.removeChild(this.floor);
    for (const corner of this.corners) {
      corner.parentNode.removeChild(corner);
    }

    // Broadcast the ground for other components to use
    this.el.emit('boundaryready', {root: ground});

    ground.setAttribute('mixin', 'boundary-ground');
    this.root.appendChild(ground);
  },

  addFloor: function (el) {
    this.floor = el;
  },

  addCorner: function (el) {
    this.corners.push(el);
  },

  removeCorner: function (el) {
    if (this.selectedCorner == el) {
      this.selectedCorner = null;
    }

    var index = this.corners.indexOf(el);
    this.corners.splice(index, 1);
  },

  setSelected: function (el, select) {
    if (select) {
      this.clearSelected();
      this.selectedCorner = el;
    } else {
      this.selectedCorner = null;
    }
    var comp = el.components.boundary_corner;
    if (el.components.boundary_floor != null) {
      comp = el.components.boundary_floor;
    }
    comp.selected = select;
    el.setAttribute('material', 'color', select ? '#FF0077' : '#7700FF');
  },
  clearSelected: function() {
    if (this.selectedCorner != null) {
      this.setSelected(this.selectedCorner, false);
    }
  }
});

AFRAME.registerComponent('boundary_floor', {
  init: function () {
    this.bindMethods();

    this.system = this.el.sceneEl.systems.boundary;
    this.selected = false;

    this.system.addFloor(this.el);
    this.el.addEventListener('cursordown', this.cursorDown);
  },

  bindMethods: function () {
    this.cursorDown = this.cursorDown.bind(this);
  },

  cursorDown: function () {
      this.el.setAttribute('material', 'color', 'green');
    this.system.setSelected(this.el, !this.selected);
    if (!this.selected) {
      this.system.createWalls();
      this.el.setAttribute('material', 'color', 'cyan');
    }
  },
});

AFRAME.registerComponent('boundary_corner', {
  init: function () {
    this.bindMethods();

    this.system = this.el.sceneEl.systems.boundary;
    this.selected = false;

    this.system.addCorner(this.el);
    this.el.addEventListener('cursordown', this.cursordown);
  },

  bindMethods: function () {
    this.cursordown = this.cursordown.bind(this);
  },

  cursordown: function (evt) {
    this.system.setSelected(this.el, !this.selected);
    if (!this.selected) {
      this.el.parentNode.removeChild(this.el);
    }
  },

  remove: function () {
    this.system.removeCorner(this.el);
  },
});

AFRAME.registerComponent('boundary_walls', {
  schema: {
    vertices: {
      default: '0 0, 0.1 0, 0 0.1',
      parse: function (str) {
        console.log('parse');
        var arr = str.split(', '); 
        var res = arr.map(function (value) {
          var [x, y] = value.split(' ');
          return new THREE.Vector2(x, y).multiplyScalar(1);
        });
        console.log(res);
        return res;
      },
      stringify: function(arr) {
        console.log('stringify');
        return arr.map(function (value) {
          return value.x + ' ' + value.y;
        }).join(', ');
      },
    },
  },
  init: function () {
    this.bindMethods();
    this.alertMessage = document.querySelector('#alertMessage');

    this.system = this.el.sceneEl.systems.boundary;
    
    this.vertices = this.data.vertices;
    this.computeProjectors();

    this.player3D = document.querySelector('a-camera').object3D.position;
    this.playerPos = new THREE.Vector2(this.player3D.x, this.player3D.z);
    this.tempVec = new THREE.Vector2();

    this.distance = 0;
    setInterval(this.tick.bind(this), 30);
  },

  tick: function () {
    this.playerPos.set(this.player3D.x, this.player3D.z);
    this.distance = this.distanceToBounds();
    //this.alertMessage.innerHTML = this.distance;
    var opacity = 0;
    opacity = 1 - (this.distance - 0.25) / 0.25;
    opacity = Math.max(0, Math.min(1, opacity));
    this.el.setAttribute('material', 'opacity', opacity);
  },

  bindMethods: function () {
    this.computeProjectors = this.computeProjectors.bind(this);
    this.distanceToBounds = this.distanceToBounds.bind(this);
  },

  computeProjectors: function () {
    this.projectors = [];

    var prev = this.vertices[this.vertices.length - 1];
    for (const vertex of this.vertices) {
      var projector = {};
      projector.zero = prev.clone();
      projector.unit = vertex.clone().sub(prev);
      projector.scale = projector.unit.clone().divideScalar(projector.unit.lengthSq());
      this.projectors.push(projector);
      prev = vertex;
    }
  },

  distanceToBounds: function () {
    var distance = Infinity;
    for (var projector of this.projectors) {
      this.tempVec.copy(this.playerPos);
      this.tempVec.sub(projector.zero);
      var t = Math.max(0, Math.min(1, this.tempVec.dot(projector.scale)));
      this.tempVec.copy(projector.zero).addScaledVector(projector.unit, t);
      distance = Math.min(distance, this.playerPos.distanceTo(this.tempVec));
    }
    return distance;
  },
});
