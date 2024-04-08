"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "swiper/css/scrollbar";
import "swiper/css/effect-creative";
import "swiper/css/zoom";
import "swiper/css/grid";
import { useEffect, useRef, useState } from "react";
import {
  FreeMode,
  Thumbs,
  Mousewheel,
  Scrollbar,
  Zoom,
  Grid,
  Keyboard,
} from "swiper/modules";

import { FaBars } from "react-icons/fa";
import { Transition, TransitionStatus } from "react-transition-group";
import clsx from "clsx";
import { Swiper as SwiperType } from "swiper/types";
import ButtonIcon from "@/components/button/ButtonIcon";
import HeaderDivider from "@/components/header/HeaderDivider";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { findNearestBiggerNumber } from "@/utils/findNearestBiggerNumber";
import { sortAsc } from "@/utils/sortArrayAsc";
import { findNearestSmallerNumber } from "@/utils/findNearestSmallerNumber";
import { MdRotate90DegreesCcw, MdFullscreen } from "react-icons/md";
import { TbArrowAutofitWidth } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  useOnClickOutside,
  useWindowSize,
  useIsClient
} from "usehooks-ts";
import ButtonOption from "@/components/button/ButtonOption";
import { slideDataImages } from "@/app/data";

type TransitionStyles = {
  [key in TransitionStatus]?: React.CSSProperties;
};

const smallSwiperTransitionDuration = 300;
const moreOptionsTransitionDuration = 150;
const zoomScaleArray = [
  0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4,
  5,
];

const smallSwiperDefaultStyle = {
  transition: `transform ${smallSwiperTransitionDuration}ms ease-out`,
  transform: "translateX(0)",
};
const moreOptionsDefaultStyle = {
  transition: `opacity ${moreOptionsTransitionDuration}ms ease-out`,
  opacity: 0,
};

const smallSwiperTransitionStyles: TransitionStyles = {
  entering: { transform: "translateX(0)" },
  entered: { transform: "translateX(0)" },
  exiting: { transform: "translateX(-100%)" },
  exited: { transform: "translateX(-100%)" },
};
const moreOptionsTransitionStyles: TransitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

interface MainSectionProps {
  isMobileDevice: boolean | undefined
}

export default function MainSection({ isMobileDevice }: MainSectionProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const moreOptionRef = useRef<HTMLDivElement>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [showSmallSwiper, setShowSmallSwiper] = useState(true);
  const [activeSlide, setActiveSlide] = useState(1);
  const [zoomScale, setZoomScale] = useState(1);
  const [fitWidth, setFitWidth] = useState(false);
  const [slideRotate, setSlideRotate] = useState(0);
  const [moreOptions, setMoreOptions] = useState(false);
  const [options, setOptions] = useState({ twoPage: false, fullScreen: false });
  const { width } = useWindowSize();
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false)
  const isClient = useIsClient()

  // close more options
  const closeMoreOptions = () => {
    setMoreOptions(false);
  };

  // close more options pop up
  useOnClickOutside(moreOptionRef, closeMoreOptions);

  // update zoom slide
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.zoom.in(zoomScale);
    }
  }, [zoomScale]);

  // disable full screen
  useEffect(() => {
    if (options.fullScreen) {
      const toggleFullscreen = () => {
        setOptions((prevState) => {
          return { ...prevState, fullScreen: false };
        });
      };
      const screenChangeDisableFullscreen = () => {
        if (!document.fullscreenElement) {
          toggleFullscreen();
        }
      };
      const screenErrorDisableFullscreen = () => {
        toggleFullscreen();
      };
      const keyDownDisableFullscreen = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          if (!document.fullscreenElement) {
            toggleFullscreen();
          }
        }
      };
      window.addEventListener(
        "fullscreenchange",
        screenChangeDisableFullscreen,
      );
      window.addEventListener("fullscreenerror", screenErrorDisableFullscreen);
      window.addEventListener("keydown", keyDownDisableFullscreen);
      return () => {
        window.removeEventListener(
          "fullscreenchange",
          screenChangeDisableFullscreen,
        );
        window.removeEventListener(
          "fullscreenerror",
          screenErrorDisableFullscreen,
        );
        window.removeEventListener("keydown", keyDownDisableFullscreen);
      };
    }
  }, [options.fullScreen]);

  // show/hide slide scrollbar when out/in full screen mode
  useEffect(() => {
    const bigSwiperScrollbar = document
      .querySelector<HTMLElement>(".big-swiper")
      ?.querySelector<HTMLElement>(".swiper-scrollbar");
    if (bigSwiperScrollbar) {
      if (options.fullScreen) {
        bigSwiperScrollbar.style.visibility = "hidden";
      } else {
        bigSwiperScrollbar.style.visibility = "visible";
      }
    }
  }, [options.fullScreen]);

  // reset slide to rotate 0 when zoom
  useEffect(() => {
    if (zoomScale) {
      setSlideRotate(0);
    }
  }, [zoomScale]);

  // show/hide small swiper
  const toggleSmallSwiper = () => setShowSmallSwiper(!showSmallSwiper);

  // toggle fit width slide
  const toggleFitWidth = () => setFitWidth(!fitWidth);

  // change rotate slide
  const handleRotateSlide = () => {
    setZoomScale(1);
    if (slideRotate === 270) {
      setSlideRotate(0);
    } else {
      setSlideRotate(slideRotate + 90);
    }
  };

  // toggle more options pop up
  const handleMoreOptions = () => setMoreOptions(!moreOptions);

  // handle toggle two page mode
  const toggleTwoPageMode = () =>
    setOptions((prevState) => {
      closeMoreOptions();
      return { ...prevState, twoPage: !prevState.twoPage };
    });

  // set activeSlide
  const handleChangeInputActiveSlide = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setActiveSlide(Number(e.target.value));
  };

  // handle action di chuyen den slide
  const handleChangeActiveSlide = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // tim slide hop le
    const s = Math.min(Math.max(1, activeSlide), slideDataImages.length);
    // set activeSlide lai thanh gia tri hop le
    setActiveSlide(s);
    // di chuyen den slide do
    if (swiperRef.current) {
      swiperRef.current.slideTo(s - 1);
    }
  };

  // set zoom scale
  const handleChangeInputZoomSlide = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setZoomScale(Number(e.target.value.replace("%", "")) / 100);
  };

  // handle action zoom slide
  const handleChangeZoomSlide = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // tim zoomScale hop le
    const z = Math.min(Math.max(zoomScaleArray[0], zoomScale), 5);
    // set zoomScale lai thanh gia tri hop le
    setZoomScale(z);
  };

  // handle action plus zoomScale
  const handlePlusZoomSlide = () => {
    const z = findNearestBiggerNumber(zoomScale, sortAsc(zoomScaleArray));
    setZoomScale(z as number);
  };

  // handle action minus zoomScale
  const handleMinusZoomSlide = () => {
    const z = findNearestSmallerNumber(zoomScale, sortAsc(zoomScaleArray));
    setZoomScale(z as number);
  };

  // toggle full screen
  const toggleFullscreen = () => {
    closeMoreOptions();
    setOptions((prevState) => {
      return { ...prevState, fullScreen: !prevState.fullScreen };
    });
    const elem = document.querySelector(".big-swiper");
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    }
  };

  // config for full screen mode mobile
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isLandscape && !isMobileLandscape) {
      htmlElement.style.transform = "rotate(90deg)";
      htmlElement.style.transformOrigin = "right top";
      htmlElement.style.width = "100vh";
      htmlElement.style.height = "100vw";
      htmlElement.style.overflow = "hidden"
      htmlElement.style.position = "absolute"
      htmlElement.style.top = "100%"
      htmlElement.style.right = "0"
      document.documentElement.style.fontSize = "2rem"
    } else {
      htmlElement.style.transform = "none";
      htmlElement.style.width = "100vw";
      htmlElement.style.height = "100vh";
      htmlElement.style.overflow = "auto"
      htmlElement.style.position = "static"
      document.documentElement.style.fontSize = "1rem"
    }
  }, [isLandscape, isMobileLandscape]);

  // detect user rotate in mobile device
  useEffect(() => {
    const detectOrientation = () => {
      setIsMobileLandscape(screen.availHeight < screen.availWidth)
    }
    detectOrientation()
    window.addEventListener("resize", detectOrientation)
    return () => {
      window.removeEventListener("resize", detectOrientation)
    }
  }, [])

  // calculate active img
  useEffect(() => {
    const imagesContainer = document.querySelector<HTMLElement>(".image-container")
    if (imagesContainer && isClient) {
      const fnc = () => {
        const images = document.querySelectorAll<HTMLElement>(".image")
        let distanceArrayPortrait: number[] = []
        let distanceArrayLandscape: number[] = []
        // not full screen mode mobile
        if (!isLandscape) {
          images.forEach((img, i) => {
            distanceArrayPortrait.push(img.getBoundingClientRect().top)
          })
          for (let i = 0; i < distanceArrayPortrait.length; i++) {
            if (Math.abs(distanceArrayPortrait[i]) <= images[i].offsetHeight / 2) {
              setActiveSlide(i + 1)
              break
            }
          }
        }
        // full screen mode mobile
        else {
          images.forEach((img, i) => {
            distanceArrayLandscape.push(img.getBoundingClientRect().left)
          })
          for (let i = 0; i < distanceArrayLandscape.length; i++) {
            if (Math.abs(distanceArrayLandscape[i]) <= images[i].offsetHeight / 2) {
              setActiveSlide(i + 1)
              break
            }
          }
        }
      }
      imagesContainer.addEventListener("scroll", fnc)
      return () => imagesContainer.removeEventListener("scroll", fnc)
    }
  }, [isClient, isLandscape, isMobileLandscape])

  return (
    <>
      <main className="relative bg-gray-main">
        {/* header */}
        {!isMobileDevice && (
          <header
            className="flex relative h-[7.5vh] bg-gray-main w-full z-20 text-white px-6 py-2 flex-row items-center"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.12) 0px 3px 4px,rgba(0, 0, 0, 0.2) 0px 2px 4px",
            }}
          >
            <div className="flex flex-row items-center">
              {/* toggle small swiper */}
              <ButtonIcon onClick={toggleSmallSwiper}>
                <FaBars className="text-neutral-100 text-1.15" />
              </ButtonIcon>

              {/* file name */}
              <strong className="text-1.15 ml-3 font-medium capitalize">
                File Name
              </strong>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-row justify-center items-center text-white">
              {/* form change active slide */}
              <form
                className="flex flex-row items-center mr-4"
                onSubmit={(e) => handleChangeActiveSlide(e)}
              >
                <input
                  type="number"
                  className="text-0.875 text-white w-7 px-1 h-5 bg-neutral-900 focus:outline-none text-center"
                  value={activeSlide}
                  onChange={(e) => handleChangeInputActiveSlide(e)}
                />
                <p className="text-0.75 text-white ml-1.5">/</p>
                <p className="text-0.75 text-white ml-1.5">
                  {slideDataImages.length}
                </p>
              </form>

              {/* divider */}
              <HeaderDivider />

              {/* form change zoom scale */}
              <form
                className="flex flex-row items-center mx-1.5"
                onSubmit={(e) => handleChangeZoomSlide(e)}
              >
                <ButtonIcon
                  type="button"
                  onClick={handleMinusZoomSlide}
                  disabled={options.twoPage}
                >
                  <FaMinus className="" />
                </ButtonIcon>
                <input
                  type="text"
                  className="text-0.875 text-white w-12 px-1 h-5 bg-neutral-900 focus:outline-none text-center mx-1.5 disabled:opacity-40 disabled:select-none"
                  value={`${Math.floor(zoomScale * 100)}%`}
                  onChange={(e) => handleChangeInputZoomSlide(e)}
                  disabled={options.twoPage}
                />
                <ButtonIcon
                  type="button"
                  onClick={handlePlusZoomSlide}
                  disabled={options.twoPage}
                >
                  <FaPlus className="" />
                </ButtonIcon>
              </form>

              {/* divider */}
              <HeaderDivider />

              {/* full width and rotate */}
              <div className="flex flex-row items-center ml-4">
                <ButtonIcon onClick={toggleFitWidth}>
                  <TbArrowAutofitWidth className="" />
                </ButtonIcon>
                <ButtonIcon onClick={handleRotateSlide}>
                  <MdRotate90DegreesCcw className="" />
                </ButtonIcon>
              </div>
            </div>

            {/* download, print */}
            <div className="ml-auto flex flex-row items-center">
              {/* more options */}
              <div ref={moreOptionRef} className="relative ml-1.5">
                {/* more options button */}
                <ButtonIcon isActive={moreOptions} onClick={handleMoreOptions}>
                  <BsThreeDotsVertical className="" />
                </ButtonIcon>

                {/* more options pop up */}
                <Transition
                  in={moreOptions}
                  timeout={moreOptionsTransitionDuration}
                >
                  {(state) => (
                    <div
                      className="absolute bottom-0 translate-y-full py-2 right-0 w-max z-40 rounded-md bg-neutral-900"
                      style={{
                        ...moreOptionsDefaultStyle,
                        ...moreOptionsTransitionStyles[state],
                        boxShadow:
                          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                      }}
                    >
                      <ButtonOption
                        isActive={options.twoPage}
                        text="Chế độ xem hai trang"
                        onClick={toggleTwoPageMode}
                      />
                      <div className="w-full my-1.5 h-px bg-neutral-700" />
                      <ButtonOption
                        text="Thuyết trình"
                        isActive={options.fullScreen}
                        onClick={toggleFullscreen}
                      />
                    </div>
                  )}
                </Transition>
              </div>
            </div>
          </header>
        )}

        {moreOptions && !isMobileDevice && (
          <div className="fixed w-screen overflow-hidden h-screen z-10 bg-transparent" />
        )}

        {/* 2 swiper */}
        <div className="h-full lg:h-[92.5vh] w-full lg:flex flex-row">
          {/* small swiper */}
          {!isMobileDevice && (
            <div
              className={clsx("h-full transition-300", {
                "w-[19%]": showSmallSwiper,
                "w-0": !showSmallSwiper,
              })}
            >
              <Transition
                in={showSmallSwiper}
                timeout={smallSwiperTransitionDuration}
              >
                {(state) => (
                  <Swiper
                    style={{
                      ...smallSwiperDefaultStyle,
                      ...smallSwiperTransitionStyles[state],
                    }}
                    onSwiper={setThumbsSwiper as any}
                    slidesPerView="auto"
                    speed={400}
                    slidesPerGroup={5}
                    spaceBetween={(width / 100) * 2}
                    mousewheel={{ sensitivity: 2 }}
                    direction="vertical"
                    freeMode
                    wrapperClass="swiper-wrapper initial-small-swiper"
                    scrollbar={{
                      enabled: true,
                      draggable: true,
                    }}
                    modules={[FreeMode, Thumbs, Mousewheel, Scrollbar]}
                    className={clsx("small-swiper")}
                    onAfterInit={() => {
                      if (document
                        .querySelectorAll(".swiper-wrapper")[0].classList.contains("initial-small-swiper")) {
                        document
                          .querySelectorAll(".swiper-wrapper")[0]
                          ?.classList.remove("initial-small-swiper");
                      }
                    }}
                  >
                    {slideDataImages.map((item, i) => {
                      return (
                        <SwiperSlide key={item.id}>
                          <Image
                            src={item.src}
                            alt={item.alt}
                            width={1920}
                            height={1080}
                            priority={i < 5}
                          />
                          <p className="swiper-slide-text">{i + 1}</p>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                )}
              </Transition>
            </div>
          )}

          {/* big swiper */}
          {!isMobileDevice && (
            <Swiper
              speed={400}
              direction="vertical"
              thumbs={{ swiper: thumbsSwiper }}
              mousewheel={true}
              slidesPerView={options.twoPage ? 2 : 1}
              slidesPerGroup={options.twoPage ? 2 : 1}
              scrollbar={{
                enabled: !isMobileDevice,
                draggable: true,
              }}
              grid={
                options.twoPage
                  ? {
                    fill: "column",
                  }
                  : undefined
              }
              zoom={true}
              autoHeight={true}
              keyboard={true}
              modules={[
                Thumbs,
                Mousewheel,
                Scrollbar,
                Grid,
                Keyboard,
                Zoom,
              ]}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              onActiveIndexChange={(swiper) => {
                setActiveSlide(swiper.activeIndex + 1);
                setZoomScale(1);
              }}
              wrapperClass="swiper-wrapper initial-big-swiper"
              onAfterInit={() => {
                if (document.querySelectorAll(".swiper-wrapper")[1].classList.contains("initial-big-swiper")) {
                  document.querySelectorAll(".swiper-wrapper")[1]?.classList.remove("initial-big-swiper")
                }
              }}
              className={clsx("big-swiper", {
                "full-width": !showSmallSwiper,
                "fit-width": fitWidth,
              })}
            >
              {slideDataImages.map((item, i) => {
                return (
                  <SwiperSlide key={item.id}>
                    <div className="swiper-zoom-container">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={1920}
                        height={1080}
                        priority={i < 2}
                        className={clsx("swiper-slide-image", {
                          "slide-rotate-0": slideRotate === 0,
                          "slide-rotate-90": slideRotate === 90,
                          "slide-rotate-180": slideRotate === 180,
                          "slide-rotate-270": slideRotate === 270,
                          "fit-width": fitWidth,
                          "not-fit-width": !fitWidth,
                        })}
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>

        {isMobileDevice && (
          <div key={isLandscape ? 2 : 1} className={clsx("image-container grid grid-cols-1 p-1.5 text-white gap-1.5 overflow-auto", {
            "h-screen": !isLandscape,
            "w-[100vh] h-[100vw]": isLandscape && !isMobileLandscape
          })}>
            {slideDataImages.map((item, i) => {
              return (
                <div key={item.id} className="">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    className={clsx("image", {
                      "w-full object-cover": !isLandscape,
                      "h-[100vw] object-contain": isLandscape && !isMobileLandscape
                    })}
                    width={1920}
                    height={1080}
                    priority={i < 4}
                  />
                </div>
              )
            })}
          </div>
        )}

        {/* active slide mobile */}
        {isMobileDevice && (
          <div className="fixed px-4 py-1.5 top-3.5 left-3.5 rounded-lg font-bold z-40 text-0.875 backdrop-blur-md bg-gradient-to-r from-white/60 to-white/40 text-black/80">
            {activeSlide} / {slideDataImages.length}
          </div>
        )}

        {/* full screen mobile btn */}
        {isMobileDevice && !isMobileLandscape && (
          <button
            type="button"
            className="flex size-8 rounded-full bg-gradient-to-r from-white/60 to-white/40 fixed top-3.5 right-3.5 z-40 font-bold justify-center items-center"
            onClick={() => {
              setIsLandscape(!isLandscape);
            }}
          >
            <MdFullscreen className="text-[1.5rem] text-black/80" />
          </button>
        )}
      </main>
    </>
  );
}
