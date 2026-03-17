export const useAnimations = () => {
  const animateOnScroll = (
    element: string | Element,
    animation: gsap.TweenVars,
    triggerOptions?: ScrollTrigger.Vars
  ) => {
    const { $gsap, $ScrollTrigger } = useNuxtApp()
    if (!$gsap || !$ScrollTrigger) return

    const gsapInstance = $gsap as typeof import('gsap').gsap

    gsapInstance.fromTo(
      element,
      { opacity: 0, y: 60, ...animation },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element as string,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          ...triggerOptions,
        },
      }
    )
  }

  const staggerReveal = (
    elements: string | Element,
    stagger: number = 0.1
  ) => {
    const { $gsap } = useNuxtApp()
    if (!$gsap) return

    const gsapInstance = $gsap as typeof import('gsap').gsap

    gsapInstance.fromTo(
      elements,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elements as string,
          start: 'top 85%',
        },
      }
    )
  }

  const magneticEffect = (element: HTMLElement) => {
    const { $gsap } = useNuxtApp()
    if (!$gsap) return

    const gsapInstance = $gsap as typeof import('gsap').gsap

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsapInstance.to(element, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      gsapInstance.to(element, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)',
      })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }

  const parallaxEffect = (element: string, speed: number = 0.5) => {
    const { $gsap } = useNuxtApp()
    if (!$gsap) return

    const gsapInstance = $gsap as typeof import('gsap').gsap

    gsapInstance.to(element, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }

  return { animateOnScroll, staggerReveal, magneticEffect, parallaxEffect }
}
