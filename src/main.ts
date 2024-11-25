import './style.css'
import gsap from 'gsap'

class App {
  wrapper: HTMLElement | null
  assets: [
    {
      img: HTMLImageElement | null
      x: number | 0
      y: number | 0
      beingRemoved: boolean | false
    }
  ]
  mouse: {
    prevX: number | 0
    prevY: number | 0
    currX: number | 0
    currY: number | 0
  }
  count: number = 0

  library: HTMLImageElement[] = []

  timeout: any

  constructor() {
    this.wrapper = null
    this.assets = [
      {
        img: null,
        x: 0,
        y: 0,
        beingRemoved: false,
      },
    ]

    this.assets.shift()

    this.mouse = {
      prevX: 0,
      prevY: 0,
      currX: 0,
      currY: 0,
    }
    this.count = 0
    this.library = []
    this.init()
  }

  async init() {
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('wrapper')
    document.body.prepend(this.wrapper)

    await this.load()
    this.addEventListeners()
  }

  async load() {
    // load assets
    // this.assets[0].img = new Image()
    // this.assets[0].img.src = '/black.jpg'
    // this.assets[0].img.onload = () => {
    //   console.log('asset loaded')
    // }
    // load library
    for (let i = 0; i < 8; i++) {
      const img = new Image()
      img.src = `/${i + 1}.jpg`

      img.onload = () => {
        if (this.library) {
          this.library[i] = img
        }
      }
    }
  }

  // Spawn function
  spawn(mouse: { x: number; y: number }) {
    const img = document.createElement('img')
    const random = this.getImageIndex()

    if (this.library) {
      img.src = `${this.library[random].src}`
    }
    img.className = `image image-${this.assets.length}`
    img.style.position = 'absolute'
    img.style.opacity = '0'
    img.style.transform = 'scale(0)'
    img.style.zIndex = (this.count++).toString()

    img.onload = () => {
      this.spawnAnimation(img, mouse)
    }
  }

  getImageIndex() {
    const mod = this.count % this.library.length
    return mod
  }

  spawnAnimation(img: HTMLImageElement, mouse: { x: number; y: number }) {
    this.wrapper?.prepend(img)

    img.style.left = `${mouse.x - img.width / 2}px`
    img.style.top = `${mouse.y - img.height / 2}px`

    this.assets.push({
      img,
      x: mouse.x - img.width / 2,
      y: mouse.y - img.height / 2,
      beingRemoved: false,
    })

    gsap.fromTo(
      img,
      {
        autoAlpha: 0,
        scale: 0,
        // random rotation on spawn between -15  and 15 degrees
        rotateZ: Math.random() * 20 - 10,
      },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(3.75)',
        // random rotation on spawn between -15  and 15 degrees
        rotateZ: Math.random() * 20 - 10,
        onStart: () => {
          // remove image if it's more than 5
          if (this.assets.length > 5) {
            const count = this.assets.length - 5
            for (let i = 0; i < count; i++) {
              if (this.assets[i].img && !this.assets[i].beingRemoved) {
                this.assets[i].beingRemoved = true
                this.removeImage(this.assets, i)
              }
            }
          }
        },
      }
    )
  }

  removeImage(assets: [{ img: HTMLImageElement | null; x: number; y: number; beingRemoved: boolean }] | null, index: number) {
    // remove image after 5 seconds
    if (assets && !assets[index]?.img && !assets[index].beingRemoved) return

    // console.log(img, this.assets)
    if (assets) {
      gsap.to(assets[index]?.img, {
        autoAlpha: 0,
        scale: 0,
        duration: 1.2,
        ease: 'back.out(3)',
        rotateZ: Math.random() * 20 - 10,
        // onStart: () => {
        //   if (assets[index]?.img && !assets[index].beingRemoved) {
        //     assets[index].beingRemoved = true
        //   }
        // },
        onComplete: () => {
          // console.log('removed')
          // check if image is being removed

          // if (!assets[index]) return
          // console.log(index)
          // // remove image from dom and assets array
          // if (assets[index]?.img) {
          //   // this.assets.shift()
          //   this.wrapper?.removeChild(assets[index]?.img)
          //   console.log('removed', index)

          //   if (assets[index]?.img) {
          //     assets[index].beingRemoved = false
          //   }
          // }

          if (assets[index]?.img) {
            if (this.wrapper?.contains(assets[index]?.img)) {
              this.wrapper.removeChild(assets[index]?.img)
            }
          }
        },
      })
    }
  }

  detectInactivity() {
    this.timeout = setTimeout(() => {
      console.log('inactivity')
      for (let i = 0; i < this.assets.length; i++) {
        this.removeImage(this.assets, i)
      }
      // this.assets.splice(0, this.assets.length)
    }, 2000)
  }

  addEventListeners() {
    window.addEventListener('mousemove', (e) => {
      // call spawn if mouse move delta is over 100
      this.mouse.currX = e.clientX - this.mouse.prevX
      this.mouse.currY = e.clientY - this.mouse.prevY

      clearTimeout(this.timeout)

      if (Math.abs(this.mouse.currX) > 100 || Math.abs(this.mouse.currY) > 100) {
        this.spawn({ x: e.clientX, y: e.clientY })
        this.mouse.prevX = e.clientX
        this.mouse.prevY = e.clientY
      } else if (Math.abs(this.mouse.currX) < 100 || Math.abs(this.mouse.currY) < 100) {
        // console.log('inactivity')
        this.detectInactivity()
      }
    })
  }
}

new App()
