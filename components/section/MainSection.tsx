"use client";

import Image from "next/image";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "swiper/css/scrollbar";
import "swiper/css/effect-creative";
import "swiper/css/grid";
import { useEffect, useReducer, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { Transition } from "react-transition-group";
import clsx from "clsx";
import ButtonIcon from "@/components/button/ButtonIcon";
import HeaderDivider from "@/components/header/HeaderDivider";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { findNearestBiggerNumber } from "@/utils/findNearestBiggerNumber";
import { sortAsc } from "@/utils/sortArrayAsc";
import { findNearestSmallerNumber } from "@/utils/findNearestSmallerNumber";
import { MdRotate90DegreesCcw, MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { TbArrowAutofitWidth, TbArrowAutofitHeight, TbLoader2 } from "react-icons/tb";
import { useIsClient, useOnClickOutside } from "usehooks-ts";
import { isIos } from "@/utils/isIos";
import gsap from "gsap"
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { clickedSmallImagesReducer } from "@/reducer/clickedSmallImagesReducer";
import useSWR from "swr"
import { fetcher } from "@/utils/fetcher";
import SmallImagesSkeleton from "../skeleton/SmallImagesSkeleton";
import BigImageSkeleton from "../skeleton/BigImageSkeleton";
import MobileImagesSkeleton from "../skeleton/MobileImagesSkeleton";
import { FaAngleDown } from "react-icons/fa6";
import Lang from "./Lang";

const zoomScaleArray = [
  0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4,
  5,
];

interface MainSectionProps {
  isMobileDevice: boolean | undefined,
  api: string
}

gsap.registerPlugin(ScrollToPlugin)

export default function MainSection({ isMobileDevice, api }: MainSectionProps) {
  const headerRef = useRef<HTMLHeadElement>(null)
  const smallImageModalRef = useRef<HTMLDivElement>(null)
  const [showSmallImage, setShowSmallImage] = useState(true);
  const [activeImage, setActiveImage] = useState(1);
  const [zoomScale, setZoomScale] = useState(1);
  const [fitWidth, setFitWidth] = useState(false);
  const [imageRotate, setImageRotate] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false)
  const isClient = useIsClient()
  const [draftActiveImage, setDraftActiveImage] = useState(1)
  const [draftZoomScale, setDraftZoomScale] = useState(1)
  const timeOutRef = useRef<any>(null)
  const [beforeZoomActiveImage, setBeforeZoomActiveImage] = useState(1)
  const { data, isLoading } = useSWR(api, fetcher)
  const [clickedSmallImages, dispatchClickedSmallImages] = useReducer(clickedSmallImagesReducer, []);
  const [imagesCount, setImagesCount] = useState(10)
  const [isOpenSectionMenu, setIsOpenSectionMenu] = useState(false)
  const [currenSection, setCurrentSection] = useState("")
  const sectionMenuRef = useRef<HTMLElement>(null)

  useOnClickOutside(sectionMenuRef, () => setIsOpenSectionMenu(false))

  // show/hide small swiper
  const toggleSmallSwiper = () => setShowSmallImage(!showSmallImage);

  // toggle fit width slide
  const toggleFitWidth = () => setFitWidth(!fitWidth);

  // change rotate slide
  const handleRotateSlide = () => {
    if (imageRotate === 270) {
      setImageRotate(0);
    } else {
      setImageRotate(imageRotate + 90);
    }
  };

  // handle action di chuyen den slide
  const handleSubmitActiveImage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // tim slide hop le
    const draft = Math.min(Math.max(1, draftActiveImage), imagesCount);
    // set activeImage lai thanh gia tri hop le
    setActiveImage(draft);
    setDraftActiveImage(draft)
    gsap.to(document.querySelector(".image-container"), { duration: 0.5, scrollTo: document.querySelectorAll(".image")[draft - 1] })
  };

  // set zoom scale
  const handleChangeInputZoomSlide = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDraftZoomScale(Number(e.target.value.replace("%", "")) / 100);
  };

  // handle action zoom slide
  const handleChangeZoomSlide = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // tim zoomScale hop le
    const draft = Math.min(Math.max(zoomScaleArray[0], draftZoomScale), 5);
    // set zoomScale lai thanh gia tri hop le
    setZoomScale(draft);
    setDraftZoomScale(draft)
    setBeforeZoomActiveImage(activeImage)
  };

  // handle action plus zoomScale
  const handlePlusZoomSlide = () => {
    const z = findNearestBiggerNumber(zoomScale, sortAsc(zoomScaleArray));
    setZoomScale(z as number);
    setDraftZoomScale(z as number)
    setBeforeZoomActiveImage(activeImage)
  };

  // handle action minus zoomScale
  const handleMinusZoomSlide = () => {
    const z = findNearestSmallerNumber(zoomScale, sortAsc(zoomScaleArray));
    setZoomScale(z as number);
    setDraftZoomScale(z as number)
    setBeforeZoomActiveImage(activeImage)
  };

  // set data after fetch
  useEffect(() => {
    if (data) {
      let count = 0
      data.acf.images.forEach((item: any) => {
        count += item.gallery.length
      })
      setImagesCount(count)
      setCurrentSection(data.acf.images[0].header)
      dispatchClickedSmallImages({
        type: "setClickedSmallImages", value: Array.from({ length: count }, (_, i) => i + 1).map((item: any) => {
          return { index: item, clicked: false }
        })
      })
    }
  }, [data, isLoading])

  // config for full screen mode mobile
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isLandscape && !isMobileLandscape) {
      htmlElement.style.transform = "rotate(90deg)";
      htmlElement.style.transformOrigin = "right top";
      if (isIos()) {
        htmlElement.style.width = "89vh";
      } else {
        htmlElement.style.width = "92.5vh";
      }
      htmlElement.style.height = "100vw";
      htmlElement.style.overflow = "hidden"
      htmlElement.style.position = "absolute"
      htmlElement.style.top = "100%"
      htmlElement.style.right = "0"
    } else {
      htmlElement.style.transform = "none";
      htmlElement.style.width = "auto";
      htmlElement.style.height = "auto";
      htmlElement.style.overflow = "auto"
      htmlElement.style.position = "static"
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

  // calculate active img on desktop
  useEffect(() => {
    if (!isMobileDevice) {
      const imagesContainer = document.querySelector<HTMLElement>(".image-container")
      const images = document.querySelectorAll<HTMLElement>(".image")
      const imagesThumbContainer = document.querySelector<HTMLElement>(".image-thumb-container")
      const imagesThumb = document.querySelectorAll<HTMLElement>(".image-thumb")
      if (imagesContainer && headerRef.current && imagesThumbContainer) {
        const detectActiveImage = () => {
          clearTimeout(timeOutRef.current);
          for (let i = 0; i < images.length; i++) {
            if (Math.abs(images[i].getBoundingClientRect().top - headerRef.current!.offsetHeight) <= images[i].offsetHeight / 2 + parseFloat(window.getComputedStyle(imagesContainer).getPropertyValue("gap")) / 2) {
              setActiveImage(i + 1)
              setDraftActiveImage(i + 1)
              setCurrentSection(images[i].dataset.section!)
              const isClickedSmallImages = clickedSmallImages.some(item => {
                return item.clicked
              })
              const rect = imagesThumb[i].getBoundingClientRect()
              if (!(rect.top >= headerRef.current!.offsetHeight && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth))) {
                if (!isClickedSmallImages) {
                  gsap.to(imagesThumbContainer, {
                    duration: 0.5, scrollTo: { y: imagesThumb[i], offsetY: parseFloat(window.getComputedStyle(imagesThumbContainer).getPropertyValue("padding-top")) }
                  })
                }
              }
              if (!isClickedSmallImages && zoomScale <= 1) {
                timeOutRef.current = setTimeout(() => {
                  gsap.to(imagesContainer, { duration: 0.5, scrollTo: { y: images[i], autoKill: true } })
                }, 500)
              }
              break;
            }
          }
        }
        imagesContainer.addEventListener("scroll", detectActiveImage)
        return () => imagesContainer.removeEventListener("scroll", detectActiveImage)
      }
    }
  }, [clickedSmallImages, isMobileDevice, zoomScale])

  // calculate active img on mobile
  useEffect(() => {
    if (isMobileDevice) {
      const imagesContainer = document.querySelector<HTMLElement>(".image-container-mobile")
      const images = document.querySelectorAll<HTMLElement>(".image-mobile")
      if (imagesContainer && isClient) {
        const fnc = () => {
          let distanceArrayPortrait: number[] = []
          let distanceArrayLandscape: number[] = []
          // not full screen mode mobile
          if (!isLandscape) {
            images.forEach((img, i) => {
              distanceArrayPortrait.push(img.getBoundingClientRect().top)
            })
            for (let i = 0; i < distanceArrayPortrait.length; i++) {
              if (Math.abs(distanceArrayPortrait[i]) <= images[i].offsetHeight / 2 + parseFloat(window.getComputedStyle(imagesContainer).getPropertyValue("gap")) / 2) {
                setActiveImage(i + 1)
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
              if (Math.abs(distanceArrayLandscape[i]) <= images[i].offsetHeight / 2 + parseFloat(window.getComputedStyle(imagesContainer).getPropertyValue("gap")) / 2) {
                setActiveImage(i + 1)
                break
              }
            }
          }
        }
        imagesContainer.addEventListener("scroll", fnc)
        return () => imagesContainer.removeEventListener("scroll", fnc)
      }
    }
  }, [isClient, isLandscape, isMobileDevice, isMobileLandscape])

  // scroll to active img when rotate mobile
  useEffect(() => {
    if (isMobileDevice && data) {
      document.querySelectorAll(".image-mobile")[activeImage - 1].scrollIntoView(true)
    }
  }, [data, isLandscape, isMobileDevice])

  // stay focus at before zoom image
  useEffect(() => {
    if (isClient && data) {
      gsap.to(document.querySelector(".image-container"), { duration: 0, scrollTo: document.querySelectorAll<HTMLElement>(".image")[beforeZoomActiveImage - 1], overwrite: true })
    }
  }, [beforeZoomActiveImage, data, isClient, zoomScale])

  return (
    <>
      <main className="relative bg-gray-main h-screen">
        {/* header */}
        {!isMobileDevice && (
          <header
            ref={headerRef}
            className="flex relative h-[7.5vh] bg-gray-main w-full z-20 text-white px-6 py-2 flex-row items-center"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.12) 0px 3px 4px,rgba(0, 0, 0, 0.2) 0px 2px 4px",
            }}
          >
            <div className="flex flex-row items-center">
              {/* toggle small image container */}
              <ButtonIcon onClick={toggleSmallSwiper}>
                <FaBars className="text-neutral-100 text-1.15" />
              </ButtonIcon>

              {/* file name */}
              {/* TODO: replace with logo */}
              <strong className="title text-1.15 ml-3 font-medium capitalize">
                Credential
              </strong>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-row justify-center items-center text-white">
              {/* form change active slide */}
              <form
                className="flex flex-row items-center mr-4"
                onSubmit={(e) => handleSubmitActiveImage(e)}
              >
                <input
                  type="number"
                  className="text-0.875 text-white w-8 px-1 h-5 bg-neutral-900 focus:outline-none text-center"
                  value={draftActiveImage}
                  onChange={(e) => setDraftActiveImage(parseInt(e.target.value))}
                />
                <p className="text-0.75 text-white ml-1.5">/</p>
                <p className="text-0.75 text-white ml-1.5">
                  {isLoading ? <TbLoader2 className="animate-spin" /> : imagesCount}
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
                >
                  <FaMinus className="" />
                </ButtonIcon>
                <input
                  type="text"
                  className="text-0.875 text-white w-12 px-1 h-5 bg-neutral-900 focus:outline-none text-center mx-1.5 disabled:opacity-40 disabled:select-none"
                  value={`${Math.floor(draftZoomScale * 100)}%`}
                  onChange={(e) => handleChangeInputZoomSlide(e)}
                />
                <ButtonIcon
                  type="button"
                  onClick={handlePlusZoomSlide}
                >
                  <FaPlus className="" />
                </ButtonIcon>
              </form>

              {/* divider */}
              <HeaderDivider />

              {/* full width and rotate */}
              <div className="flex flex-row items-center ml-4">
                <ButtonIcon onClick={toggleFitWidth}>
                  {fitWidth ? <TbArrowAutofitWidth className="" /> : <TbArrowAutofitHeight className="" />}
                </ButtonIcon>
                <ButtonIcon onClick={handleRotateSlide}>
                  <MdRotate90DegreesCcw className="" />
                </ButtonIcon>
              </div>
            </div>

            {/* select section */}
            <button ref={sectionMenuRef as any} className="relative min-w-[16rem] h-[2.35rem] px-3 ml-auto text-white bg-black rounded-md text-0.875 flex flex-row items-center justify-evenly transition-300 hover:bg-neutral-600" onClick={() => setIsOpenSectionMenu(!isOpenSectionMenu)}>
              <div className="text-start grow">{isLoading ? <div className="h-5 w-2/3 rounded bg-neutral-400 animate-pulse" /> : currenSection}</div>
              <FaAngleDown className="text-neutral-400 ml-3 transition-300" style={isOpenSectionMenu ? { transform: "rotateX(180deg)" } : undefined} />
              <ul className={clsx("absolute -bottom-1 left-0 w-full translate-y-full bg-black z-10 rounded-md transition-300 max-h-[15rem] overflow-auto p-1.5 grid grid-cols-1 gap-1", {
                "opacity-100 scale-1 pointer-events-auto": isOpenSectionMenu,
                "opacity-0 scale-[0.92] pointer-events-none": !isOpenSectionMenu
              })}
                style={{ "boxShadow": "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}>
                {isLoading ? "" : (
                  <>
                    {data.acf.images.map((section: any) => {
                      return (
                        <li
                          key={section.header}
                          className={clsx("py-2 transition-300 rounded-md text-start px-3 capitalize", {
                            "hover:bg-neutral-600": section.header !== currenSection,
                            "bg-neutral-600": section.header === currenSection
                          })}
                          onClick={() => {
                            const images = document.querySelectorAll<HTMLElement>(".image")
                            const imageContainer = document.querySelector(".image-container")
                            const imagesThumb = document.querySelectorAll(".image-thumb")
                            const imageThumbContainer = document.querySelector(".image-thumb-container")
                            for (let i = 0; i < images.length; i++) {
                              if (images[i].dataset.section === section.header) {
                                gsap.to(imageContainer, { duration: 0, scrollTo: images[i] })
                                gsap.to(imageThumbContainer, { duration: 0, scrollTo: { y: imagesThumb[i], offsetY: parseFloat(window.getComputedStyle(imageThumbContainer!).getPropertyValue("padding-top")) }, overwrite: true })
                                break
                              }
                            }
                          }}
                        >
                          {section.header}
                        </li>
                      )
                    })}
                  </>
                )}
              </ul>
            </button>

            {/* select language */}
            <Lang className="ml-6" isMobileDevice={isMobileDevice} />
          </header>
        )}

        {!isMobileDevice && (
          <div className="relative flex flex-row">
            {/* thumb images */}
            <Transition
              in={showSmallImage}
              mountOnEnter
              unmountOnExit
              addEndListener={(node, done) => {
                const imageContainer = document.querySelector<HTMLElement>(".image-container")
                const ctx = gsap.context(() => {
                  if (showSmallImage) {
                    const tl = gsap.timeline({})
                    tl.to(smallImageModalRef.current, { flexBasis: "20%", duration: 0.4 })
                    tl.set(imageContainer, { flexBasis: "80%" })
                    tl.to(smallImageModalRef.current, { xPercent: 0, duration: 0.4 })
                  } else {
                    const tl = gsap.timeline({})
                    tl.to(smallImageModalRef.current, { xPercent: "-100", duration: 0.4 })
                    tl.set(smallImageModalRef.current, { flexBasis: "0%" })
                    tl.set(imageContainer, { marginLeft: "20vw", flexBasis: "100%" })
                    tl.to(imageContainer, { marginLeft: 0, duration: 0.4 })
                  }
                }, node);
              }}
            >
              <div
                ref={smallImageModalRef}
                className="basis-1/5 flex-none overflow-y-auto"
              >
                <div className="grid grid-cols-1 gap-6 py-6 overflow-auto h-[92.5vh] image-thumb-container">
                  {isLoading ? <SmallImagesSkeleton /> : (
                    <>
                      {data.acf.images.map((section: any, j: number) => {
                        return (
                          <>
                            {section.gallery.map((item: any, i: number) => {
                              let count = 0
                              for (let g = 0; g <= j; g++) {
                                if (g - 1 >= 0) {
                                  count += data.acf.images[g - 1].gallery.length
                                }
                              }
                              const index = count + i
                              return (
                                <div
                                  key={item.id}
                                  className={clsx("mx-auto flex flex-col h-[6.7rem] w-[9.15rem] transition-400 cursor-pointer image-thumb scroll-py-4 select-none", {
                                    "opacity-100": activeImage === index + 1,
                                    "opacity-50 hover:opacity-80": activeImage !== index + 1,
                                  })}
                                  onClick={() => {
                                    const imageContainer = document.querySelector(".image-container")
                                    dispatchClickedSmallImages({ type: "toggleClickedImage", index: index + 1, value: true })
                                    gsap.to(imageContainer, {
                                      duration: 0.5, scrollTo: document.querySelectorAll(".image")[index], onComplete: () => dispatchClickedSmallImages({ type: "toggleClickedImage", index: index + 1, value: false })
                                    })
                                  }}
                                >
                                  <Image
                                    src={item.url}
                                    alt={item.alt}
                                    width={140}
                                    height={78}
                                    priority={i < 5}
                                    className={clsx("h-3/4 object-cover transition-400",
                                      { "ring-[6px] ring-blue-main": activeImage === index + 1 })}
                                  />
                                  <p className="text-center text-white text-0.75 mt-2.5 transition-400">{index + 1}</p>
                                </div>
                              )
                            })}
                          </>
                        )
                      })}
                    </>
                  )}
                </div>
              </div>
              {/* )} */}
            </Transition>
            {/* images */}
            <div
              className={clsx("basis-4/5 h-[92.5vh] grid grid-cols-1 py-1 overflow-auto image-container items-center justify-center w-full")}
              style={{ gap: `calc(0.75rem*${zoomScale})` }}
            >
              {isLoading ? <BigImageSkeleton /> : (
                <>
                  {data.acf.images.map((section: any) => {
                    return (
                      <>
                        {section.gallery.map((item: any, i: number) => {
                          return (
                            <div
                              key={item.id}
                              data-section={section.header}
                              className={clsx("image overflow-hidden transition-400", {
                                "rotate-90": imageRotate === 90,
                                "rotate-180": imageRotate === 180,
                                "rotate-[270deg]": imageRotate === 270,
                                "min-w-max": !fitWidth && zoomScale > 1,
                                "w-full": fitWidth
                              })}
                              style={!fitWidth ? { height: `calc(92.5vh*${zoomScale})` } : { height: "max-content" }}
                            >
                              <Image
                                src={item.url}
                                alt={item.alt}
                                width={1920}
                                height={1080}
                                priority={i < 2}
                                quality={100}
                                className={clsx("mx-auto object-contain", { "h-full w-auto": !fitWidth, "w-full h-auto": fitWidth })}
                              />
                            </div>
                          )
                        })}
                      </>
                    )
                  })}
                </>
              )}
            </div>
          </div >
        )}

        {isMobileDevice && (
          <div className={clsx("image-container-mobile relative grid grid-cols-1 text-white gap-1.5 overflow-auto h-full", {
            "h-screen": !isLandscape,
          })}
            style={isLandscape && !isMobileLandscape ? { width: "100%", height: "100vw" } : undefined}
          >
            {isLoading ? <MobileImagesSkeleton /> : (
              <>
                {data.acf.images.map((section: any) => {
                  return (
                    <>
                      {section.gallery.map((item: any, i: number) => {
                        return (
                          <div key={item.id} data-section={section.header} className="image-mobile flex justify-center items-center mx-auto">
                            <Image
                              src={item.url}
                              alt={item.alt}
                              className={clsx("", {
                                "w-full object-cover": !isLandscape,
                                "h-[100vw] object-contain": isLandscape && !isMobileLandscape,
                              })}
                              width={1920}
                              height={1080}
                              priority={i < 4}
                            />
                          </div>
                        )
                      })}
                    </>
                  )
                })}
              </>
            )}

            {/* active slide mobile */}
            {isMobileDevice && (
              <div className="fixed px-4 py-1.5 top-3.5 left-3.5 rounded-lg font-bold z-40 text-0.875 md:text-[1.5rem] backdrop-blur-md bg-gradient-to-r from-white/80 to-white/70 text-black/80 flex flex-row items-center">
                {activeImage} / {isLoading ? <TbLoader2 className="animate-spin ml-0.5" /> : imagesCount}
              </div>
            )
            }

            <div ref={sectionMenuRef as any} className="fixed top-3.5 right-3.5 z-40">
              <button className="size-9 rounded-full flex items-center bg-white justify-center z-50" onClick={() => setIsOpenSectionMenu(!isOpenSectionMenu)} style={{ "boxShadow": "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px" }}>
                {isOpenSectionMenu ? <IoMdClose className="text-[1.5rem] text-black/80" /> : <IoMdMenu className="text-[1.5rem] text-black/80" />}
              </button>
              {isLoading ? "" : <ul className={clsx("absolute top-[45%] right-[45%] bg-white min-w-[15rem] max-h-[12.5rem] overflow-auto -z-10 grid grid-cols-1 gap-1 p-1.5 rounded-md transition-300", {
                "opacity-100 scale-1 pointer-events-auto": isOpenSectionMenu,
                "opacity-0 scale-[0.92] pointer-events-none": !isOpenSectionMenu
              })} style={{ "boxShadow": "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}>
                <Lang className="px-1.5" isMobileDevice={isMobileDevice} />
                {data.acf.images.map((section: any) => {
                  return (
                    <li
                      key={section.header}
                      className="text-black p-1.5 rounded-md"
                      onClick={() => {
                        const images = document.querySelectorAll<HTMLElement>(".image-mobile")
                        for (let i = 0; i < images.length; i++) {
                          if (images[i].dataset.section === section.header) {
                            images[i].scrollIntoView(true)
                            break
                          }
                        }
                        setIsOpenSectionMenu(false)
                      }}
                    >
                      {section.header}
                    </li>
                  )
                })}
              </ul>}
            </div>

            {/* full screen mobile btn */}
            {isMobileDevice && !isMobileLandscape && (
              <button
                type="button"
                className="flex size-8 rounded-full bg-gradient-to-r from-white/80 to-white/70 fixed bottom-3.5 right-3.5 z-40 font-bold justify-center items-center"
                onClick={() => {
                  setIsLandscape(!isLandscape);
                }}
              >
                {isLandscape ? <MdFullscreenExit className="text-[1.5rem] text-black/80" /> : <MdFullscreen className="text-[1.5rem] text-black/80" />}
              </button>
            )}
          </div>
        )
        }

      </main >
    </>
  );
}
