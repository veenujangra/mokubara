import './style.css'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'

class App {
  assets: [
    {
      img: HTMLImageElement | null
      x: number
      y: number
    }
  ]
  canvas: HTMLElement | null
  mouse: {
    x: number
    y: number
    position: number | 0
  }
  sizes: {
    width: number
    height: number
  }
  count = 0

  constructor() {
    this.assets = [
      {
        img: null,
        x: 0,
        y: 0,
      },
    ]
    this.canvas = null
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
    this.mouse = {
      x: 0,
      y: 0,
      position: 0,
    }

    this.init()

    this.addEventListeners()

    this.registerPlugins()
  }

  async init() {
    // Adding a canvas
    this.canvas = document.createElement('div')
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.style.backgroundColor = 'black'
    this.canvas.className = 'canvas'

    document.body.appendChild(this.canvas)

    await this.loadAssets()
  }

  async loadAssets() {
    // Load assets here
    this.assets.shift()
    const img = new Image()
    img.src = '/public/black .jpg'
    img.className = 'image'
    img.onload = () => {
      this.assets.push({ img, x: 0, y: 0 })
      // console.log(this.assets)
    }
    // console.log(this.assets)
    // this.update()

    // for (let i = 0; i < 10; i++) {
    //   const img = new Image()
    //   img.src = '../public/black.jpg'
    //   img.onload = () => {
    //     this.assets.push(img)
    //   }
    // }
  }

  addEventListeners() {
    // this.canvas?.addEventListener('mouseenter', this.mouseEnter.bind(this))

    window.addEventListener('mousemove', (e) => {
      const deltaX = Math.abs(this.mouse.x - e.clientX)
      const deltaY = Math.abs(this.mouse.y - e.clientY)

      this.mouse.x = e.clientX
      this.mouse.y = e.clientY

      if (deltaX > 10 || deltaY > 10) {
        this.addImage()
      }

      // this.mouse.x = (e.clientX / this.sizes.width) * 2 - 1
      // this.mouse.y = -(e.clientY / this.sizes.height) * 2 + 1

      // console.log(this.mouse)
    })

    this.canvas?.addEventListener('mousemove', this.mousemove.bind(this))
  }

  addImage() {
    // Image spawns at mouse position
    // const state = Flip.getState(this.assets[0])
    // console.log(this.assets[0])
    if (this.assets[0].img) {
      console.log('added')

      const img = new Image()
      img.src = '/public/black .jpg'
      img.className = `image item-${this.count++}`
      img.onload = () => {
        this.assets.push({ img, x: 0, y: 0 })
        // console.log(this.assets)
      }
      this.canvas?.appendChild(img)

      img.style.left = this.mouse.x - img.getBoundingClientRect().width / 2 + 'px'
      img.style.top = this.mouse.y - img.getBoundingClientRect().height / 2 + 'px'

      // If images are more than 5 then remove the first image
      if (this.assets.length > 5) {
        this.canvas?.removeChild(img)
        this.assets.shift()
      }
    }

    console.log(this.assets)

    // Flip.from(state, {
    //   duration: 1,
    //   scaleX: 1,
    //   scaleY: 1,
    //   alpha: 1,
    //   ease: 'power4.back',
    // })
  }

  mousemove() {}

  update() {
    // console.log(this.assets[0]?.getBoundingClientRect().width)

    this.assets.forEach((asset) => {
      if (asset.img) {
        asset.x = gsap.utils.interpolate(asset.x, this.mouse.x - asset.img.getBoundingClientRect().width / 2, 0.125)
        asset.y = gsap.utils.interpolate(asset.y, this.mouse.y - asset.img.getBoundingClientRect().height / 2, 0.125)

        asset.img.style.left = asset.x + 'px'
        asset.img.style.top = asset.y + 'px'
      }
    })
    requestAnimationFrame(this.update.bind(this))
  }

  registerPlugins() {
    gsap.registerPlugin(Flip)
  }
}

new App()
