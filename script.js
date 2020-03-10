var camera, scene, renderer, light, helper, controls, i = 0, j = 0, bl = 20
var letters = []
var rotate = []
var trigger = true
//const axis = new THREE.Vector3( 0, 1, 0 ).normalize()

var gui = new dat.gui.GUI()

const obj = {
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  targetX: 0,
  targetY: 0,
  targetZ: 0,
  lightColor:  [ 255, 255, 255 ]
}

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
    if (item.rotation.y < 6.0) {
      counter++
      item.rotation.y += 0.1
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
//  gui.add(light.position, 'x', -200, 200)
//  gui.add(light.position, 'y', -200, 200)
//  gui.add(light.position, 'z', -200, 200)
//  gui.add(light.target.position, 'x', -200, 200)
//  gui.add(light.target.position, 'y', -200, 200)
//  gui.add(light.target.position, 'z', -200, 200)
//  gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
  
  scene.add(light)
  scene.add(light.target)

//  helper = new THREE.SpotLightHelper(light)
//  scene.add(helper)
  
//  var bulbGeometry = new THREE.SphereBufferGeometry( 0.02, 16, 8 )
//  bulbLight = new THREE.PointLight( 0x800000, 1, 100, 2 )
//
//  bulbMat = new THREE.MeshStandardMaterial( {
//         emissive: 0x333333,
//         emissiveIntensity: 1,
//         color: 0x000000
//  } )
//  bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) )
//  bulbLight.position.set( 0.5, 0.1, 7 )
//  bulbLight.castShadow = true
//  scene.add( bulbLight )
  
  var loader = new THREE.FontLoader()
  loader.load( 'https://cheburator.info/font/Prompt_Light_Regular.json', function (font) {
    let text = 'TELESCOPE'
    let arr = text.split('')
    let offset = 30
    
    arr.forEach((item, index) => {
      var geometry = new THREE.TextGeometry(item, {
        font: font,
        size: 9,
        height: 0.5,
        curveSegments: 4,
        bevelEnabled: false,
        bevelThickness: 0.02,
        bevelSize: 0.05,
        bevelSegments: 3
      })

      var material = new THREE.MeshLambertMaterial({
        color: 0xa6c7ff,
        emissive: 0x000000,
      })
      var mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(-120 + index * offset, 0, 60)
      mesh.geometry.center()
      letters.push(mesh)
      
      scene.add(mesh)
    })

    rotate = letters.map(item => count(item))
  })
  
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
  const footer = document.querySelector('footer')
  footer.style.color = '#797882'
//  document.body.appendChild( renderer.domElement )
}

function animate() {
//  light.position.x = math.lerp(light.position.x, 98, data.ease)
//  light.position.y = math.lerp(light.position.y, 63, data.ease)
  light.position.z = math.lerp(light.position.z, 180, data.ease)
  light.target.position.x = math.lerp(light.target.position.x, 33, data.ease)
  light.target.position.y = math.lerp(light.target.position.y, 77, data.ease)
  light.target.position.z = math.lerp(light.target.position.z, 16, data.ease)
  requestAnimationFrame( animate )
  renderer.render( scene, camera )

//  letters[6].rotateOnAxis( axis, Math.PI * 0.01 )
//
  
 
  for (let k = 0; k < j; k++) {
    rotate[k]()
  }

  if (i < bl) {
    i++
  } else {
    i = 0
    if (j < letters.length) {
      j++
    }
  }

//  if (i < letters.length) {
//     if (letters[i].rotation.y < 6.2 ) {
//      letters[i].rotation.y += 0.2
//    } else {
//      i++
//    }
//  }

//  helper.update()
}

function resize() {
  renderer.setSize( window.innerWidth, window.innerHeight )
}

