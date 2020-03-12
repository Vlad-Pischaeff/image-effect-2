var camera, scene, renderer, light, helper, controls
var gui = new dat.gui.GUI()
const loader = new THREE.FontLoader()

class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

//----------------------------------------------------------
init()
animate()
//----------------------------------------------------------
function loadFont(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject)
  })
}

function init() {
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 )
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 240

  scene = new THREE.Scene()

  const color = 0xFFFFFF;
  const intensity = 1;
  light = new THREE.SpotLight(color, intensity)
  light.penumbra = 1
  
  gui.add(light.position, 'x', -200, 200)
  gui.add(light.position, 'y', -200, 200)
  gui.add(light.position, 'z', -200, 200)
  gui.add(light.target.position, 'x', -200, 200)
  gui.add(light.target.position, 'y', -200, 200)
  gui.add(light.target.position, 'z', -200, 200)
  gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
  
  scene.add(light)
  scene.add(light.target)

  helper = new THREE.SpotLightHelper(light)
  scene.add(helper)
  


  // promisify font loading


  async function doText(str) {
    let font = await loadFont('Prompt_Light_Regular.json')
    let arr = str.split('')
    
    arr.forEach((item, index) => {
      let geometry = new THREE.TextBufferGeometry(item, {
          font: font,
          size: 13.0,
          height: .2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.15,
          bevelSize: .3,
          bevelSegments: 5,
      })

      let material = new THREE.MeshLambertMaterial({
        color: 0xa6c7ff,
        emissive: 0x000000,
      })

      let mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(-160 + 30 * index, 0, 40)

      scene.add(mesh)
    })
  }

  doText('TELESCOPE')


  const width = window.innerWidth
  const height = window.innerHeight
  const widthSegments = window.innerWidth/10
  const heightSegments = window.innerHeight/10
  const square = new THREE.PlaneBufferGeometry(width, height, widthSegments, heightSegments)
  material = new THREE.MeshLambertMaterial({
    color: 0x0d1b33,
    emissive: 0x000000,
  })
  var mesh1 = new THREE.Mesh(square, material)
  mesh1.position.set( 0, 0, -40)
  scene.add(mesh1)
  
  renderer = new THREE.WebGLRenderer( { antialias: true } )
  renderer.setSize( window.innerWidth, window.innerHeight )

  document.body.appendChild( renderer.domElement )
}

function animate() {
  requestAnimationFrame( animate )
  renderer.render( scene, camera )
  helper.update()
}

