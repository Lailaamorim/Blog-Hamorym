import React, { useState, useEffect } from "https://esm.sh/react@19"
import { createRoot } from "https://esm.sh/react-dom@19/client"
import { motion, Reorder, resize } from "https://esm.sh/motion/react"

const whileDrag = {
  scale: 1.05,
  boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
  zIndex: 10,
}

const CardOne = ({ layer }) => {
  return (
    <Reorder.Item 
      value={layer}
      whileDrag={whileDrag}
      className="max-w-full w-50 aspect-3/2 bg-[#f0e7d6] shadow-sm flex items-center justify-center relative whitespace-nowrap tracking-wider uppercase cursor-grab transition-[box-shadow]">
      <div className="text-3xl font-(family-name:--font-bricolage) lowercase font-semibold">f</div>

      <div className="absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 scale-60 font-semibold text-xs">founder</div>
      <div className="absolute right-4 top-1/2 translate-x-1/2 -translate-y-1/2 rotate-90 scale-60 font-semibold text-xs">creative director</div>

      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold tracking-widest scale-80">alicia potter</div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-semibold scale-60">helo@creative.com</div>
    </Reorder.Item>
  )
}

const CardTwo = ({ layer }) => {
  return (
    <Reorder.Item 
      value={layer}
      whileDrag={whileDrag}
      className="max-w-full w-50 aspect-3/2 bg-[#eed4cd] shadow-sm flex items-center justify-center text-center cursor-grab transition-[box-shadow]">
      <div className="text-3xl font-(family-name:--font-bricolage) font-semibold leading-[0.8] tracking-tight">
        faven
        <br />
        creative
      </div>
    </Reorder.Item>
  )
}

const App = () => {
  const [items, setItems] = useState(
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      type: i % 2 === 0 ? "one" : "two"
    }))
  )
  const [axis, setAxis] = useState('x')

  useEffect(() => {
    const unsubscribe = resize(({ width }) => {
      setAxis(width < 768 ? 'y' : 'x')
    })
    return () => unsubscribe()
  }, [])

  return (
    <>
      <Reorder.Group 
        axis={axis}
        values={items}
        onReorder={setItems}
        className="grid md:grid-cols-4 gap-8"
        >
        {items.map((item) => (
          item.type === 'one' 
          ? <CardOne key={item.id} layer={item} /> 
          : <CardTwo key={item.id} layer={item} />
        ))}
      </Reorder.Grinterface Sheet {
  url: string;
}

type RoundButtonConfig = {
  sprite: string;
  width: number;
  height: number;
  totalFrames: number;
  columns: number;
  fps?: number;
  isActive: boolean;
  onClick?: () => void;
  onHoverStart?: () => void;
  onReverseComplete?: () => void;
};

class RoundButton {
  element: HTMLAnchorElement;

  width: number;
  height: number;
  totalFrames: number;
  columns: number;
  fps: number;
  cframe = 0;
  animId: number | null = null;
  hovering = false;
  reversing = false;

  onClick?: () => void;
  onHoverStart?: () => void;
  onReverseComplete?: () => void;

  constructor(container: HTMLElement, config: RoundButtonConfig) {
    // Create <a>
    this.element = document.createElement("a");
    this.element.className = "button";
    this.element.href = "#";
    this.element.setAttribute("role", "button");
    if (config.isActive) this.element.classList.add("active");

    // Sprite setup
    this.width = config.width;
    this.height = config.height;
    this.totalFrames = config.totalFrames;
    this.columns = config.columns;
    this.fps = config.fps ?? 30;

    this.onClick = config.onClick;
    this.onHoverStart = config.onHoverStart;
    this.onReverseComplete = config.onReverseComplete;

    Object.assign(this.element.style, {
      width: `${this.width}px`,
      height: `${this.height}px`,
      display: "inline-block",
      backgroundImage: `url(${config.sprite})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "0px 0px",
      cursor: "pointer"
    });

    container.appendChild(this.element);

    // Bind
    this.animate = this.animate.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleClick = this.handleClick.bind(this);

    // Events
    this.element.addEventListener("mouseover", this.handleMouseOver);
    this.element.addEventListener("mouseout", this.handleMouseOut);
    this.element.addEventListener("click", this.handleClick);

    this.renderFrame();
  }

  handleClick(e: MouseEvent) {
    e.preventDefault();
    const clickedEl = e.currentTarget as HTMLElement;

    document.querySelectorAll(".button").forEach((btn) => {
      btn.classList.remove("active");
    });

    clickedEl.classList.add("active");
    this.onClick?.();
  }

  handleMouseOver() {
    this.hovering = true;
    this.reversing = false;
    this.onHoverStart?.();

    if (!this.animId) {
      this.animate();
    }
  }

  handleMouseOut() {
    this.hovering = false;
    this.reversing = true;

    if (!this.animId) {
      this.animate();
    }
  }

  animate() {
    this.renderFrame();

    if (this.hovering) {
      this.cframe = (this.cframe + 1) % this.totalFrames;
    } else if (this.reversing) {
      this.cframe--;
      if (this.cframe <= 0) {
        this.cframe = 0;
        this.reversing = false;
        this.animId = null;
        this.onReverseComplete?.();
        return;
      }
    } else {
      this.animId = null;
      return;
    }

    setTimeout(() => {
      this.animId = requestAnimationFrame(this.animate);
    }, 1000 / this.fps);
  }

  renderFrame() {
    const col = this.cframe % this.columns;
    const row = Math.floor(this.cframe / this.columns);

    this.element.style.backgroundPosition = `${-col * this.width}px ${
      -row * this.height
    }px`;
  }
}

class SpriteAnimator {
  private element: HTMLElement;
  private preloadElement: HTMLElement;
  private allSpriteSheets: Sheet[][];
  private spriteSheets: Sheet[];
  private frameWidth: number;
  private frameHeight: number;
  private columns: number;
  private totalFrames: number;
  private currentFrame: number = 0;
  private currentSpriteIndex: number = 0;
  private nextIdleIndex: number = 0;
  private nextClickIndex: number = 0;
  private fps: number;
  private intervalId: number | null = null;
  private preloaded: Set<string> = new Set();
  private containerEl: HTMLElement;
  private messageEl: HTMLElement;
  private questionEl: HTMLElement;
  private queuedClick: boolean = false;
  private playingClick: boolean = false;

  constructor(
    spriteSheets: Sheet[][],
    sheetIndex: number,
    frameWidth: number,
    frameHeight: number,
    columns: number,
    fps: number = 24,
    totalFrames: number = 121,
    classString?: string
  ) {
    this.allSpriteSheets = spriteSheets;
    this.currentSpriteIndex = sheetIndex;
    this.spriteSheets = this.allSpriteSheets[this.currentSpriteIndex];

    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.columns = columns;
    this.fps = fps;
    this.totalFrames = totalFrames;
    // Container setup
    this.containerEl = document.createElement("div");
    this.containerEl.classList.add("container");
    this.containerEl.classList.add("waiting");
    if (classString) this.containerEl.classList.add(classString);
    this.containerEl.title = "click and ask a question.";

    this.messageEl = document.createElement("div");
    this.messageEl.classList.add("message");
    this.messageEl.innerHTML = "one moment, thinking";
    this.containerEl.appendChild(this.messageEl);

    this.questionEl = document.createElement("div");
    this.questionEl.classList.add("question");
    this.questionEl.innerHTML = "ask a question and click me";
    this.containerEl.appendChild(this.questionEl);

    this.element = document.createElement("div");
    this.element.classList.add("sprite");
    this.containerEl.appendChild(this.element);
    document.body.appendChild(this.containerEl);

    this.preloadElement = document.createElement("div");
    this.preloadElement.classList.add("preload");
    this.containerEl.appendChild(this.preloadElement);

    this.setSpriteSheet(this.pickRandomIndex(11, 37));

    this.nextIdleIndex = this.pickRandomIndex(11, 37);
    this.nextClickIndex = this.pickRandomIndex(0, 10);
    this.preload(this.nextIdleIndex);
    this.preload(this.nextClickIndex);

    this.containerEl.addEventListener("click", () => {
      this.containerEl.classList.add("clicked");
      this.queuedClick = true;
    });
  }

  public setSpriteGroup(index: number) {
    if (this.currentSpriteIndex === index) return;
    this.currentSpriteIndex = index;
    this.spriteSheets = this.allSpriteSheets[this.currentSpriteIndex];
    this.nextIdleIndex = this.pickRandomIndex(11, 37);
    this.setSpriteSheet(this.nextIdleIndex);
  }

  private pickRandomIndex(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private preload(index: number) {
    const sheet = this.spriteSheets[index];
    if (this.preloaded.has(sheet.url)) return;

    const img = new Image();
    img.src = sheet.url;
    img.onload = () => {
      this.preloaded.add(sheet.url);
      if (this.preloaded.size === this.spriteSheets.length) {
        this.preloadElement.remove();
      }
    };
    this.preloadElement.appendChild(img);
  }

  private setSpriteSheet(index: number) {
    const sheet = this.spriteSheets[index];
    this.element.style.backgroundImage = `url(${sheet.url})`;
    this.currentFrame = 0;
  }

  private updateSprite() {
    const col = this.currentFrame % this.columns;
    const row = Math.floor(this.currentFrame / this.columns);
    const xOffset = -(col * this.frameWidth);
    const yOffset = -(row * this.frameHeight);
    this.element.style.backgroundPosition = `${xOffset}px ${yOffset}px`;
    this.currentFrame++;

    if (this.currentFrame === 2) {
      if (this.playingClick) {
        this.nextIdleIndex = this.pickRandomIndex(11, 37);
        this.nextClickIndex = this.pickRandomIndex(0, 10);
        this.preload(this.nextIdleIndex);
        this.preload(this.nextClickIndex);
      } else {
        this.nextIdleIndex = this.pickRandomIndex(11, 37);
        this.nextClickIndex = this.pickRandomIndex(0, 10);
        this.preload(this.nextIdleIndex);
        this.preload(this.nextClickIndex);
      }
    }

    if (this.currentFrame >= this.totalFrames) {
      this.stop();

      if (this.playingClick) {
        // Click animation just finished
        this.playingClick = false;
        this.containerEl.classList.add("waiting"); // show waiting message again
        this.setSpriteSheet(this.nextIdleIndex);
        this.start();
      } else if (this.queuedClick) {
        // User just clicked — start click animation
        this.queuedClick = false;
        this.playingClick = true;
        this.containerEl.classList.remove("waiting"); // hide waiting message
        this.containerEl.classList.remove("clicked");

        this.setSpriteSheet(this.nextClickIndex);
        this.start();
      } else {
        // Normal idle transition
        this.containerEl.classList.add("waiting");
        this.setSpriteSheet(this.nextIdleIndex);
        this.start();
      }
    }
  }

  public start() {
    if (this.intervalId !== null) return;
    this.intervalId = window.setInterval(
      () => this.updateSprite(),
      1000 / this.fps
    );
  }

  public stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

import type { Sheet } from "./sheet";

const charSheet: Sheet[][] = [
  [
    {
      url: "https://assets.codepen.io/163598/ex01-yes-01-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-yes-02-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-maybe-02-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-ask-01-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-ask-02-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-yes-03-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-yes-04-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-maybe-01-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-no-01-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-no-02-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-no-03-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-01-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-02-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-03-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-04-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-05-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-06-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-07-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-08-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-09-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-10-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-11-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-12-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-13-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-14-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-12-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-15-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-16-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-17-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-18-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-19-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-20-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-21-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-22-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-23-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-24-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-25-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex01-26-sprite.png"
    }
  ],

  [
    {
      url: "https://assets.codepen.io/163598/ex02-yes-01-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-yes-02-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-no-04-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-maybe-01-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-maybe-02-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-yes-03-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-no-01-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-no-02-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-no-03-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-ask-01-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-ask-02-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-01-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-02-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-03-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-04-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-05-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-06-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-07-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-24-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-09-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-10-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-11-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-12-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-13-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-14-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-12-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-25-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-16-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-17-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-18-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-19-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-20-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-21-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-22-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-23-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-24-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-25-sprite.png"
    },
    {
      url: "https://assets.codepen.io/163598/ex02-26-sprite.png"
    }
  ]
];

const indexSheet: Sheet[] = [
  {
    url: "https://assets.codepen.io/163598/ex01-00-sprite.png"
  },
  {
    url: "https://assets.codepen.io/163598/ex02-00-sprite.png"
  }
];

window.addEventListener("DOMContentLoaded", () => {
  const sheetIndex = 0;
  const man1 = new SpriteAnimator(charSheet, sheetIndex, 320, 320, 5, 24);
  man1.start();

  const container = document.getElementById("charSelect");
  const classes = ["blue", "red"];

  document.body.classList.add(`${classes[sheetIndex]}`);
  for (let i = 0; i < indexSheet.length; i++) {
    new RoundButton(container, {
      sprite: indexSheet[i].url,
      width: 75,
      height: 75,
      totalFrames: 121,
      columns: 5,
      onClick: () => {
        document.body.className = "";
        document.body.classList.add(`${classes[i]}`);
        man1.setSpriteGroup(i);
      },
      fps: 120,
      isActive: i == sheetIndex
    });
  }
});
oup>

      {/* shadow */}
      <div className="fixed -top-6 -right-6 w-full h-[110dvh] bg-[linear-gradient(225deg,#36100c65_33%,transparent_0)] blur-md pointer-events-none z-50"></div>
    </>
  )
}

const root = createRoot(document.getElementById("app"))

root.render(<App />)
    preloader.complete(() => {
      // Initialize gallery after preloader fades out
      gallery = new FashionGallery();
      gallery.init();
    });
  }, 2000); // 2 seconds preloader duration
});

<section>
  
  <h1 data-count-from="1">10</h1>
  <hr>Simple

  <div style="position:absolute;bottom:20px;opacity:0.5;font-size:1rem">(scroll down)</div>
</section>

<section>
  <h2 data-count-from="50" data-count-sec="2" data-count-post="%">15%</h2>
  <hr>Percentage
</section>

<section>
  <h2 data-count-from="0" data-count-by="0.5" data-count-sec="3.3">7.5</h2>  
  <hr>Fractional counting
</section>  

<section>
  <ul>
    <li data-count-from="0" data-count-pre="$" data-count-by=".1" data-count-post=" Million">$7.5 Million</li>
    <li data-count-from="0" data-count-pre="$" data-count-by="10" data-count-sec="2">$150,000</li>
    <li data-count-from="0" data-count-pre="$" data-count-by="1000">$1,946,512,000</li>
  </ul>
  <hr> List
</section>  

<section>
  <h2 data-count-from="10" data-count-scrub="true">0</h2>
  <hr> Scrub
</section>  

<section>
  <div class="row">
      <span data-count-from="0" data-count-by="0.5">5.0</span> : <span data-count-from="0">25</span>
  </div>
  <hr> Inline  
</section>

<section>(scroll up)</section>

<!--
Required:
  data-count-from (requires a number)

Optional:
  data-count-by (defaults to 1)
  data-count-sec (defaults to 2 seconds)
  data-count-pre (insert text before the count)
  data-count-post (insert text after the count)
  data-count-scrub (defaults to false, true ties the count to the scroll progress)
--></>