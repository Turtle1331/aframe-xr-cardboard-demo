AFRAME.registerComponent('coin_object', {
  init: function () {
    this.bindMethods();

    this.active = false;
    this.tree = null;
    this.coinParent = null;
    this.numChildren = null;

    this.el.addEventListener('collisions', this.onCollision);
  },

  bindMethods: function () {
    this.activate = this.activate.bind(this);
    this.setTree = this.setTree.bind(this);
    this.onCollision = this.onCollision.bind(this);
  },

  activate: function () {
    this.active = true;
    this.el.setAttribute('material', 'color', 'green');
  },

  setTree: function (p, c) {
    this.tree = true;
    this.coinParent = p;
    this.numChildren = c;
  },

  alert: function () {
    if (this.tree) {
      this.numChildren--;
      if (this.numChildren <= 0) {
        this.activate();
      }
    }
  },

  onCollision: function (e) {
    console.log(e);
    if (this.active) {
      if (this.tree && this.coinParent != null) {
        this.coinParent.alert();
      }
      this.el.parentNode.removeChild(this.el);
    }
  },
});
