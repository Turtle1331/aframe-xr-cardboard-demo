AFRAME.registerSystem('boundary', {
  init: function () {
    this.hello = 'world';
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
      return corner.x + ' ' + corner.z;
    }).join(', ');
    var height = 2;
    
    var entity = document.createElement('a-entity');
    entity.setAttribute('mixin', 'boundary-walls');
    entity.setAttribute('geometry', 'vertices', vertices);
    /*
    entity.setAttribute('geometry', {
      primitive: 'prism',
      vertices: vertices,
      height: height,
    });
    entity.setAttribute('material', {
      side: THREE.DoubleSide,
      color: 'cyan',
      transparent: true,
      alpha: 0.5,
    });
    */
    this.root.appendChild(entity);
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
