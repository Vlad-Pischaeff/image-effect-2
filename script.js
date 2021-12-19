var camera, scene, renderer, light, helper, controls, i = 0, j = 0, bl = 15
var letters = []
var isRotated = []
var trigger = true
const text = 'TELESCOPE'
const loader = new THREE.FontLoader()

const math = {
  lerp: (a, b, n) => {
    return (1 - n) * a + n * b
  },
  norm: (value, min, max) => {
    return (value - min) / (max - min)
  }
}

function count(item) {
  let counter = 0
  return function() {
    if (item.rotation.y < 6.2) {
      counter++
      item.rotation.y += 0.1
      return false
    } else {
      return true
    }
  }
}

const data = {
  ease: 0.02,
  current: 0,
  last: 0
}

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

function loadFont(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject)
  })
}

function setFooterColor() {
  const footer = document.querySelector('footer')
  footer.style.color = '#797882'
}
//----------------------------------------------------------
init()
animate()
//----------------------------------------------------------
function init() {
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 )
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 240

  scene = new THREE.Scene()

  const color = 0xfff2db;
  const intensity = 1;
  light = new THREE.SpotLight(color, intensity)
  light.penumbra = 1
  light.position.x = 98
  light.position.y = 63
  light.position.z = -100
  
  light.target.position.x = 0
  light.target.position.y = 0
  light.target.position.z = 200
  
  scene.add(light)
  scene.add(light.target)

  async function doText(str) {
    let font = await loadFont('https://github.com/Vlad-Pischaeff/image-effect-2/blob/master/Prompt_Light_Regular.json')
    let arr = str.split('')
    let offset = 30 
    
    arr.forEach((item, index) => {
      let geometry = new THREE.TextBufferGeometry(item, {
          font: font,
          size: 9.0,
          height: .5,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 0.15,
          bevelSize: .3,
          bevelSegments: 5,
      })

      let material = new THREE.MeshLambertMaterial({
        color: 0xa6c7ff,
        emissive: 0x000000,
      })

      let mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(-120 + offset * index, 0, 40)
      mesh.geometry.center()
      mesh.rotation.set( 0, Math.PI, 0)
      letters.push(mesh)
      
      scene.add(mesh)
    })
    isRotated = letters.map(item => count(item))
  }

  doText(text)
  
  const width = window.innerWidth
  const height = window.innerHeight
  const widthSegments = window.innerWidth/10
  const heightSegments = window.innerHeight/10
  const square = new THREE.PlaneBufferGeometry(width, height, widthSegments, heightSegments)
  var material = new THREE.MeshLambertMaterial({
    color: 0x0d1b33,
    emissive: 0x000000,
  })
  var mesh1 = new THREE.Mesh(square, material)
  mesh1.position.set( 0, 0, -40)
  scene.add(mesh1)
  
  const canvas = document.getElementById('c1')
  renderer = new THREE.WebGLRenderer( {canvas: canvas, antialias: true } )
  renderer.setSize( window.innerWidth, window.innerHeight )
  
  window.addEventListener("resize", resize)
}

function animate() {

  if (trigger) {
    light.position.z = math.lerp(light.position.z, 180, data.ease)
    light.target.position.x = math.lerp(light.target.position.x, 33, data.ease)
    light.target.position.y = math.lerp(light.target.position.y, 77, data.ease)
    light.target.position.z = math.lerp(light.target.position.z, 16, data.ease)
    requestAnimationFrame( animate )
    renderer.render( scene, camera )
    console.log('render')
  }
 
  for (let k = 0; k < j; k++) {
    if (isRotated[k]() && k == (j - 1)) {
      trigger = false
      setFooterColor()
    }
  }

  if (i < bl) {
    i++
  } else {
    i = 0
    if (j < text.length) {
      j++
    }
  }

}

function resize() {
  renderer.setSize( window.innerWidth, window.innerHeight )
}

