import * as THREE from "three";
import { mapService } from "@/map/services/MapService";
import { TileType } from "@/map/models/TileType";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import { NavigationalTileType } from "@/map/models/NavigationalTileType";
import { PathService } from "@/map/services/PathService";
import { DirectionType, TileModel } from "@/map/models/TileModel";
import { getMarkerSVG } from "./MarkerTypes";
import {OrbitControls} from "three-stdlib";
import {observe} from "mobx";
import {MapFormat, mapStore} from "@/stores/map";
import {uiStore} from "@/stores/ui";
import {database, RoomModel} from "@/mocks/database";
import {Vector2} from "three";

// @ts-nocheck
class ThreeJsMapViewModel {
    private initialized = false;
    private scene!: THREE.Scene;
    private currentFloor;
    private camera!: THREE.PerspectiveCamera;
    private controls!: MapControls;
    private raycaster!: THREE.Raycaster;
    private rc2d!: THREE.Raycaster;

    public startFound = false;
    public showPointOfInterest = false;
    private activePath: TileModel[] = [];
    private pathLengthListener: (length: number) => void = () => {};
    public displayableMarkers: number[] = [];

    constructor() {
    this.currentFloor = 1;
    }

    public setStart() {
        this.startFound = true
    }

    initialize(divContainer: any) {
        if (this.initialized) {
            return;
        }
        this.scene = new THREE.Scene();
        this.initScene();

    const renderer = new THREE.WebGLRenderer();
    this.initRenderer(renderer);

    divContainer.appendChild(renderer.domElement);

    // init camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.controls = new MapControls(this.camera, renderer.domElement);
    this.controls.target = new THREE.Vector3(
        mapService.getMapWidth(this.currentFloor) / 2,
        -10,
        0
    );

    this.initCameraAndControls(this.camera, this.controls);

    this.initLights();

    // init map
    this.initFloorOnScene(this.currentFloor);
    this.listenFloorChanges();
    this.listenMapFormatChanges();

    this.raycaster = new THREE.Raycaster();
    this.rc2d = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event: any) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(scene.children);

      for (let i = 0; i < intersects.length && 1; i++) {
        // @ts-ignore
        if (intersects[i].object.isSprite) {
          if (intersects.length < 4) {
            return;
          }
          // @ts-ignore
          if (intersects[2].object.tile) {
            if (
              // @ts-ignore
              intersects[2].object.tile.navType == NavigationalTileType.STAIRS
            ) {
              if (this.currentFloor == 1) {
                this.initFloorOnScene(2);
                return;
              } else {
                this.initFloorOnScene(1);
                return;
              }
            }
          }
        }

        // @ts-ignore
        if (!intersects[i].object.tile) {
          return;
        }

        // @ts-ignore
        if (intersects[i].object.tile) {
            // @ts-ignore
            let obj: RoomModel = database.find(el => el.id ==intersects[i].object.tile.id);
            if (obj !== undefined) {
                uiStore.openClassroomSheet(obj);
            }
            if (// @ts-ignore
                intersects[i].object.tile.navType == NavigationalTileType.STAIRS) {
                if (this.currentFloor == 1) {
                  this.initFloorOnScene(2);
                  return;
                } else {
                  this.initFloorOnScene(1);
                  return;
            }
          }
        }
      }
    };

    window.addEventListener("click", onClick, false);

    let scene = this.scene;
    let camera = this.camera;
    let controls = this.controls;
    const animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    this.initialized = true;
    }

    private initScene() {
    // let bgColor = 0xd6d2ca;
    // this.scene.background = new THREE.Color(bgColor);
    // this.scene.fog = new THREE.Fog(bgColor, 20, 50);
    }

    private initRenderer(renderer: THREE.WebGLRenderer) {
    renderer.setClearColor( new THREE.Color( "rgb(50, 50, 50)" ), 1 );
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 1.75;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    private initLights() {
      // Create directional light and add it to the scene
      /* Lights */
      var ambLight = new THREE.AmbientLight( 0xFFFFFF );
      const light = new THREE.PointLight( "#ffffff");
      light.intensity = 2;
      light.position.set(600,10,600)
      light.castShadow = true;
      light.shadow.mapSize.width = 512
      light.shadow.mapSize.height = 512
      light.shadow.camera.near = 1
      light.shadow.camera.far = 500
      this.scene.add(
          light,
          ambLight,
      )
      // const light = new THREE.DirectionalLight(0xffffff, 1);
      // light.position.set(1, 1, 1);
      // light.castShadow = true; // Enable shadow casting
      // light.shadow.mapSize.width = 1024; // Set shadow map size
      // light.shadow.mapSize.height = 1024; // Set shadow map size
      // light.shadow.camera.near = 0.5; // Set shadow camera near plane
      // light.shadow.camera.far = 100; // Set shadow camera far plane
      // this.scene.add(light);
    }

    private initCameraAndControls(camera: THREE.PerspectiveCamera, controls: MapControls) {
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.maxPolarAngle = Math.PI / 2;
    controls.listenToKeyEvents(window);
    controls.update();
    }

    public setPath(from: TileModel | null, to: TileModel | null) {
        let pathService = new PathService();
        if (from && to) {
          this.activePath = pathService.findPath(from, to) || [];
        }
        this.updatePath();
    }

    public getCurrentRoom() : RoomModel | null {
        const direction = new THREE.Vector3(0, 0, -1);
        const raycaster = new THREE.Raycaster(this.camera.position, direction);
        raycaster.setFromCamera(new Vector2(0, 0), this.camera);
        const intersects = raycaster.intersectObjects(this.scene.children);
        console.log(intersects)
        for (let i = 0; i < intersects.length && 1; i++) {
            // @ts-ignore
            if (intersects[i].object.tile) {
                // @ts-ignore
                let obj: RoomModel = database.find(el => el.id ==intersects[i].object.tile.id);
                if (obj !== undefined) {
                    return obj;
                }
            }
        }
        return null;
    }
    private updatePath() {
        this.clearPath();

        this.activePath?.forEach((node) => {
          if (node.floorNumber !== this.currentFloor) {
            return;
          }
          const geometry = new THREE.PlaneGeometry(1, 1);
          let material = new THREE.MeshBasicMaterial({ color: "red" });
          const cube = new THREE.Mesh(geometry, material);
          cube.position.set(node.x, 0, node.y);
          // rotate with node direction
          cube.rotateX((-90 * Math.PI) / 4);
          cube.rotateZ((-90 * Math.PI) / 4);
          // @ts-ignore
          cube.tag = "path";
          this.scene.add(cube);
        });
        this.pathLengthListener(this.activePath.length);
    }

    public clearPath() {
    // @ts-ignore
    this.scene.children = this.scene.children.filter((child) => child.tag !== "path")
    }

    public initFloorOnScene(floorNumber: number) {
    if (!this.scene) {
      return;
    }
    this.currentFloor = floorNumber;
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }

    if (mapStore.format === MapFormat.d3) {
        this.draw3DMap(floorNumber);
    } else if (mapStore.format === MapFormat.d2) {
        this.draw2DMap(floorNumber);
    }

    this.drawRoomMarkers(floorNumber);
    this.updatePath();
    }

    private draw3DMap(floorNumber: number) {
        this.camera.position.set(
            mapService.getMapWidth(this.currentFloor) / 2,
            10,
            mapService.getMapHeight(this.currentFloor) + 10
        );
        this.controls.target = new THREE.Vector3(
            mapService.getMapWidth(this.currentFloor) / 2,
            -10,
            0
        );
        mapService.getFloor(floorNumber).tiles.forEach((tile, _) => {
            if (tile.type === TileType.NONE) {
                return;
            }
            if (tile.type === TileType.FLOOR) {
                const geometry = new THREE.PlaneGeometry(1, 1);
                let material = new THREE.MeshBasicMaterial({color: new THREE.Color( "rgb(180, 180, 180)")});
                const cube = new THREE.Mesh(geometry, material);
                // @ts-ignore
                cube.tile = tile;
                cube.position.set(tile.x, 0, tile.y);
                cube.rotateX((-90 * Math.PI) / 4);
                cube.rotateZ((-90 * Math.PI) / 4);
                cube.receiveShadow = true;
                this.scene.add(cube);
            }
            if (tile.type === TileType.WALL) {
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                let material = new THREE.MeshBasicMaterial({ color: new THREE.Color( "rgb(255, 255, 255)" ) } );
                const cube = new THREE.Mesh(geometry, material);
                // @ts-ignore
                cube.tile = tile;
                cube.position.set(tile.x, 0, tile.y);
                cube.castShadow = true;
                this.scene.add(cube);
            }
            if (tile.type === TileType.DOOR) {
                let geometry = new THREE.PlaneGeometry(1, 1);
                let material = new THREE.MeshBasicMaterial({ color: "#ADA7B1" });
                let cube = new THREE.Mesh(geometry, material);
                // @ts-ignore
                cube.tile = tile;
                cube.position.set(tile.x, 0, tile.y);
                cube.rotateX((-90 * Math.PI) / 4);
                cube.rotateZ((-90 * Math.PI) / 4);
                this.scene.add(cube);

                geometry = new THREE.BoxGeometry(0.1, 1, 1);
                material = new THREE.MeshBasicMaterial({ color: "#ADA7B1" });
                cube = new THREE.Mesh(geometry, material);
                // @ts-ignore
                cube.tile = tile;
                cube.position.set(tile.x, 0, tile.y);
                if (tile.direction === DirectionType.LEFT) {
                    cube.rotateX((-90 * Math.PI) / 4);
                    cube.rotateZ((-90 * Math.PI) / 4);
                }
                this.scene.add(cube);
            }
            if (tile.navType === NavigationalTileType.INFO) {
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                let material = new THREE.MeshBasicMaterial({ color: "rgb(255, 255, 255)" });
                const cube = new THREE.Mesh(geometry, material);
                // @ts-ignore
                cube.tile = tile;
                cube.position.set(tile.x, 0, tile.y);
                this.scene.add(cube);
            }
            if (tile.navType === NavigationalTileType.ENTRANCE) {
                let geometry = new THREE.BoxGeometry(1, 1, 1);
                let material = new THREE.MeshBasicMaterial({ color: "#3D3D3D" });
                let cube = new THREE.Mesh(geometry, material);
                // @ts-ignore
                cube.tile = tile;
                cube.position.set(tile.x, 0, tile.y);
                this.scene.add(cube);
            }
            if (
                tile.navType === NavigationalTileType.ELEVATORS ||
                tile.navType === NavigationalTileType.STAIRS
            ) {
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                let material = new THREE.MeshBasicMaterial({ color: "rgb(255, 255, 255)" });
                const cube = new THREE.Mesh(geometry, material);
                // @ts-ignore
                cube.tile = tile;
                cube.position.set(tile.x, 0, tile.y);
                this.scene.add(cube);
            }
        });
    }

    private draw2DMap(floorNumber: number) {
        this.camera.position.set(
            mapService.getMapWidth(this.currentFloor) / 2,
            30,
            mapService.getMapHeight(this.currentFloor) / 2
        );
        this.controls.target = new THREE.Vector3(
            mapService.getMapWidth(this.currentFloor) / 2,
            -10,
            mapService.getMapHeight(this.currentFloor) / 2
        );
        mapService.getFloor(floorNumber).tiles.forEach((tile, _) => {
            if (tile.type === TileType.NONE) {
                return;
            }
            if (tile.type === TileType.FLOOR) {
                const geometry = new THREE.PlaneGeometry(1, 1);
                let material = new THREE.MeshBasicMaterial({color: new THREE.Color( "rgb(180, 180, 180)")});
                const cube = new THREE.Mesh(geometry, material);
                // @ts-ignore
                cube.tile = tile;
                cube.position.set(tile.x, 0, tile.y);
                cube.rotateX((-90 * Math.PI) / 4);
                cube.rotateZ((-90 * Math.PI) / 4);
                cube.receiveShadow = true;
                this.scene.add(cube);
                console.log("here")
            }
            if (tile.type === TileType.WALL) {
                const geometry = new THREE.PlaneGeometry(1, 1);
                let material = new THREE.MeshBasicMaterial({ color: new THREE.Color( "rgb(255, 255, 255)" ) } );
                const cube = new THREE.Mesh(geometry, material);
                // @ts-ignore
                cube.tile = tile;
                cube.position.set(tile.x, 0, tile.y);
                cube.rotateX((-90 * Math.PI) / 4);
                cube.rotateZ((-90 * Math.PI) / 4);
                cube.castShadow = true;
                this.scene.add(cube);
            }
            if (tile.type === TileType.DOOR) {
                let geometry = new THREE.PlaneGeometry(1, 1);
                let material = new THREE.MeshBasicMaterial({ color: "#ADA7B1" });
                let cube = new THREE.Mesh(geometry, material);
                // @ts-ignore
                cube.tile = tile;
                cube.position.set(tile.x, 0, tile.y);
                cube.rotateX((-90 * Math.PI) / 4);
                cube.rotateZ((-90 * Math.PI) / 4);
                this.scene.add(cube);
            }
            if (tile.navType === NavigationalTileType.INFO) {
                const geometry = new THREE.PlaneGeometry(1, 1);
                let material = new THREE.MeshBasicMaterial({ color: "rgb(255, 255, 255)" });
                const cube = new THREE.Mesh(geometry, material);
                // @ts-ignore
                cube.tile = tile;
                cube.position.set(tile.x, 0, tile.y);
                cube.rotateX((-90 * Math.PI) / 4);
                cube.rotateZ((-90 * Math.PI) / 4);
                this.scene.add(cube);
            }
            if (tile.navType === NavigationalTileType.ENTRANCE) {
                let geometry = new THREE.PlaneGeometry(1, 1);
                let material = new THREE.MeshBasicMaterial({ color: "#3D3D3D" });
                let cube = new THREE.Mesh(geometry, material);
                // @ts-ignore
                cube.tile = tile;
                cube.position.set(tile.x, 0, tile.y);
                cube.rotateX((-90 * Math.PI) / 4);
                cube.rotateZ((-90 * Math.PI) / 4);
                this.scene.add(cube);
            }
            if (
                tile.navType === NavigationalTileType.ELEVATORS ||
                tile.navType === NavigationalTileType.STAIRS
            ) {
                const geometry = new THREE.PlaneGeometry(1, 1, 1);
                let material = new THREE.MeshBasicMaterial({ color: "rgb(255, 255, 255)" });
                const cube = new THREE.Mesh(geometry, material);
                // @ts-ignore
                cube.tile = tile;
                cube.position.set(tile.x, 0, tile.y);
                cube.rotateX((-90 * Math.PI) / 4);
                cube.rotateZ((-90 * Math.PI) / 4);
                this.scene.add(cube);
            }
        });
    }

    private addSvgIcon(svg: any, width: number, height: number, x: number, y: number, z: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const img = document.createElement("img");
    img.setAttribute("src", svg);
    img.onload = () => {
      if (ctx) {
        ctx.drawImage(img, 0, 0);

        const texture = new THREE.Texture(
          canvas,
          THREE.UVMapping,
          THREE.ClampToEdgeWrapping,
          THREE.ClampToEdgeWrapping,
          THREE.LinearFilter,
          THREE.LinearMipMapLinearFilter,
          THREE.RGBAFormat,
          THREE.UnsignedByteType,
          1,
          THREE.SRGBColorSpace
        );
        texture.needsUpdate = true;

        const material = new THREE.SpriteMaterial({
          map: texture,
          toneMapped: false,
        });
        material.map!.minFilter = THREE.LinearFilter;
        const marker = new THREE.Sprite(material);
        marker.position.set(x, z, y);
        marker.name = `sprite_${Math.random()}`;
        this.scene.add(marker);
      }
    };
    // img.onerror = (e) => console.error(e);
    }

    private addTextOnMap(text: string, x: number, y: number) {
    const canvas = document.createElement("canvas");
    canvas.width = 60;
    canvas.height = 60;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#fff";
      ctx.font = "bold 35px IBM Plex Sans";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }

    const texture = new THREE.Texture(
      canvas,
      THREE.UVMapping,
      THREE.ClampToEdgeWrapping,
      THREE.ClampToEdgeWrapping,
      THREE.LinearFilter,
      THREE.LinearMipMapLinearFilter,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
      1,
      THREE.SRGBColorSpace
    );
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({
      map: texture,
      toneMapped: false,
    });
    material.map!.minFilter = THREE.LinearFilter;
    const marker = new THREE.Sprite(material);
    //@ts-ignore
    marker.isSprite = true;
    marker.name = `sprite_${Math.random()}`;
    marker.position.set(x, 0.5, y);
    this.scene.add(marker);
    }

    private addMarker(type: NavigationalTileType, x: number, y: number, z: number = 1) {
        const icon = getMarkerSVG(type);
        this.addSvgIcon(icon, 170, 170, x, y, z);
    }

    private drawRoomMarkers(floorNumber: number) {
    // console.log("floor", floorNumber)
    mapService.getFloor(floorNumber).tiles.forEach((tile, _) => {
      let markerType = null;
      if (this.displayableMarkers.length > 0 && !this.displayableMarkers.includes(tile.navType)) {
        return;
      }
      if (tile.navType !== NavigationalTileType.PATH) {
        if (
          tile.navType !== NavigationalTileType.WC &&
          tile.type === TileType.DOOR
        ) {
          markerType = NavigationalTileType.NONE;
        } else if (tile.navType !== NavigationalTileType.NONE) {
          markerType = tile.navType;
        }
      }
      if (markerType !== null) {
        let center = { x: tile.x, y: tile.y };
        if (markerType === NavigationalTileType.NONE) {
          center = mapService.getRoomCenter(tile.x, tile.y, floorNumber);
          this.addTextOnMap(`${tile.navType}`, center.x, center.y);
          if (this.displayableMarkers.length > 0)
            this.addMarker(markerType, center.x, center.y - 1, 1);
        } else {
          this.addMarker(markerType, center.x, center.y);
        }
      }
    });
    }

    cleanMarkers() {
    this.scene.children = this.scene.children.filter((el) => !el.name.includes("sprite"));
    }

    drawSpritesByDepartment(department: number[] = []) {
        this.cleanMarkers();
        this.displayableMarkers = department;
        if (department.length > 0) {
          this.showPointOfInterest = true;
        } else {
          this.showPointOfInterest = false;
        }
        this.drawRoomMarkers(this.currentFloor);
    }

    listenFloorChanges() {
        observe(mapStore, 'floor', (change) => {
            this.initFloorOnScene(change.newValue);
        });
    }

    listenMapFormatChanges() {
        observe(mapStore, 'format', (change) => {
            this.initFloorOnScene(mapStore.floor);
        });
    }

    setPathListener(listener: (floor: number) => void) {
    this.pathLengthListener = listener;
    }

    destroyPath() {
    this.activePath = [];
    this.updatePath();
    }
}

export const threeJsMapViewModel = new ThreeJsMapViewModel();
