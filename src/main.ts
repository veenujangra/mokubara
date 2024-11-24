import './style.css'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'

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
    this.mouse = {
      prevX: 0,
      prevY: 0,
      currX: 0,
      currY: 0,
    }

    this.init()

    this.load()

    this.addEventListeners()
  }

  init() {
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('wrapper')
    document.body.prepend(this.wrapper)

    // register plugins
    gsap.registerPlugin(Flip)
  }

  load() {
    this.assets[0].img = new Image()
    this.assets[0].img.src = '/black.jpg'
    this.assets[0].img.onload = () => {
      console.log('asset loaded')
    }
    this.assets.shift()
  }

  // Spawn function
  spawn(mouse: { x: number; y: number }) {
    const img = document.createElement('img')
    img.src = '/black.jpg'
    img.className = `image image-${this.assets.length}`
    img.style.position = 'absolute'
    img.style.opacity = '0'
    img.style.transform = 'scale(0)'

    img.onload = () => {
      this.spawnAnimation(img, mouse)
    }
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
        // random rotation on spawn between -  and 15 degrees
        rotateZ: Math.random() * 40 - 20,
      },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(2)',
        // random rotation on spawn between -15  and 15 degrees
        rotateZ: Math.random() * 40 - 20,
        onStart: () => {
          // // remove image after 5 seconds
          // setTimeout(() => {
          //   this.removeImage(img)
          // }, 5000)
          // // this.removeImage(img)
          // console.log(img.getBoundingClientRect().width), img.getBoundingClientRect().height
          // remove image if it's more than 5
          if (this.assets.length > 5) {
            const count = this.assets.length - 5
            for (let i = 0; i < count; i++) {
              if (this.assets[i].img && !this.assets[i].beingRemoved) {
                this.removeImage(this.assets[i].img)
              }
            }
          }
        },
      }
    )
  }

  removeImage(img: HTMLImageElement | null) {
    // remove image after 5 seconds
    if (!img) return

    // console.log(img, this.assets)

    gsap.to(img, {
      autoAlpha: 0,
      scale: 0,
      duration: 1,
      ease: 'back.out(2)',
      rotateZ: Math.random() * 30 - 15,
      onStart: () => {
        const asset = this.assets.find((asset) => asset.img === img)
        if (asset) {
          asset.beingRemoved = true
        }
      },
      // onComplete: () => {
      //   this.wrapper?.removeChild(img)
      //   this.assets.shift()
      // },
      onComplete: () => {
        console.log('removed')
        this.wrapper?.removeChild(img)
        const asset = this.assets.find((asset) => asset.img === img)
        if (asset) {
          asset.beingRemoved = false
        }
        this.assets.shift()
      },
    })

    // gsap flip
    // const state = Flip.getState(img)

    // Flip.from(state, {
    //   onStart: () => {
    //     const asset = this.assets.find((asset) => asset.img === img)
    //     if (asset) {
    //       asset.beingRemoved = true
    //     }
    //   },
    //   duration: 0.3,
    //   scale: true,
    //   scaleX: 0,
    //   scaleY: 0,
    //   // autoAlpha: 0,
    //   onComplete: () => {
    //     console.log('removed')
    //     this.wrapper?.removeChild(img)
    //     const asset = this.assets.find((asset) => asset.img === img)
    //     if (asset) {
    //       asset.beingRemoved = false
    //     }
    //     this.assets.shift()
    //   },
    // })
  }

  addEventListeners() {
    window.addEventListener('mousemove', (e) => {
      // call spawn if mouse move delta is over 100
      this.mouse.currX = e.clientX - this.mouse.prevX
      this.mouse.currY = e.clientY - this.mouse.prevY

      if (Math.abs(this.mouse.currX) > 150 || Math.abs(this.mouse.currY) > 150) {
        this.spawn({ x: e.clientX, y: e.clientY })
        this.mouse.prevX = e.clientX
        this.mouse.prevY = e.clientY
      }

      // if (Math.abs(e.movementX) > 4 || Math.abs(e.movementY) > 4) {
      //   this.spawn({ x: e.clientX, y: e.clientY })
      //   // console.log(e.movementX, e.movementY)
      // }
    })
  }
}

new App()
