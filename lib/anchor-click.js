AFRAME.registerComponent('anchor-click', {
    init: function () {
      if (!this.el.isScene) {
        console.warn('anchor-click component can only be applied to <a-scene>');
        return;
      }
      this.tapData = null;

      this.bindMethods();
      this.addDOMEls();
      this.scene = this.el.sceneEl;
      this.scene.addEventListener('xrInitialized', this.xrInitialized);
      this.scene.addEventListener('realityChanged', this.realityChanged);
      this.el.addEventListener('cursorpressed', this.cursorClick);
      this.raycaster = document.querySelector('a-cursor').components.raycaster;
    },
    addDOMEls: function () {
      var title = document.createElement('div');
      title.style.position = 'absolute';
      title.style.top = '30px';
      title.style.fontFamily = 'Arial, Helvetica, sans-serif';
      title.style.fontSize = '16px';
      title.style.fontWeight = 'bold';
      title.style.zIndex = 10;
      title.style.width = '100%';
      title.style.textAlign = 'center';
      title.innerHTML = 'Find anchors by searching on tap events.';
      document.body.appendChild(title);

      this.alertMessage = document.createElement('div');
      this.alertMessage.id = 'alertMessage';
      this.alertMessage.style.position = 'absolute';
      this.alertMessage.style.bottom = '50px';
      this.alertMessage.style.fontFamily = 'Arial, Helvetica, sans-serif';
      this.alertMessage.style.fontSize = '24px';
      this.alertMessage.style.fontWeight = 'bold';
      this.alertMessage.style.zIndex = 10;
      this.alertMessage.style.width = '100%';
      this.alertMessage.style.textAlign = 'center';
      document.body.appendChild(this.alertMessage);
    },
    bindMethods: function (){
      this.xrInitialized = this.xrInitialized.bind(this);
      this.realityChanged = this.realityChanged.bind(this);
      this.updateFrame = this.updateFrame.bind(this);
      this.onTouchStart = this.onTouchStart.bind(this);
      this.cursorClick = this.cursorClick.bind(this);
    },
    xrInitialized: function () {
      this.scene.removeEventListener('xrInitialized', this.xrInitialized);
      this.xrIsInit = true;
      // normalized device coordinates position
      this.normalizedCoordinatedPositionPointer = new THREE.Vector2();
      //Screen coordinates normalized to -1..1 (0,0 is at center and 1,1 is at top right)
      this.coordinatesToFindAnchors = new THREE.Vector2(0.5, 0.5);
      window.addEventListener('touchstart', this.onTouchStart);

      if (this.isNotStartedYet) {
        this.start();
      }
    },
    realityChanged: function (data) {
      if (data.detail === 'ar') {
        if (AFRAME.scenes[0].systems.xr.supportAR) {
          if (this.xrIsInit) {
            this.start();
          } else {
            this.isNotStartedYet = true;
          }
        }
      }
    },
    start: function () {
      this.scene.addEventListener('updateFrame', this.updateFrame);
    },
    onTouchStart: function (ev) {
      if (!ev.touches || ev.touches.length === 0) {
        console.error('No touches on touch event', ev);
        return
      }
      this.raycaster.checkIntersections();
      if (this.raycaster.intersections.length > 0) {
        var intersection = this.raycaster.intersections[0];
        var intersectedEl = intersection.object.el;
        intersectedEl.emit('cursordown', {intersection: intersection});
        this.el.emit('cursorpressed', {el: intersectedEl, intersection: intersection});
        return;
        /*
        if (this.cursorClick(this.raycaster.intersections[0])) {
          return;
        }
        */
      }
      this.tapData = [
        ev.touches[0].clientX / window.innerWidth,
        ev.touches[0].clientY / window.innerHeight
      ];
    },
    /*
    Add a node to the scene and keep its pose updated using the anchorOffset
    */

    updateFrame: function (data) {
      var frame = data.detail;
      if (this.tapData !== null) {
        var x = this.tapData[0];
        var y = this.tapData[1];
        x = y = 0.5;
        this.tapData = null;
        var self = this;
        data.detail.findAnchor(x,y).then(function (anchorOffset) {
          if (anchorOffset === null){
            self.alertMessage.innerHTML = 'miss';
          } else {
            self.alertMessage.innerHTML = 'hit @ ';
            var entity = document.createElement('a-entity');
            
            // will set the position and orientation based on the anchorOffset attached to the entity
            entity.setAttribute('xranchor', {});
            entity.components.xranchor.anchorOffset = anchorOffset;
            setTimeout(function () {
                self.alertMessage.innerHTML += JSON.stringify(entity.getAttribute('position'));
            }.bind(self), 500);
            
            self.el.emit('newanchor', {entity: entity});
          }
        }).catch(function (err) {
          console.error('Error in boundary', err);
        });
      }
    },
    cursorClick: function (evt) {
        //evt.detail.intersection.object.el.setAttribute('material', 'color', 'red');
        //this.alertMessage.innerHTML = evt.detail.intersection.object.el.tagName;
    }
});
