import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "@/components/hero8-header";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import Image from "next/image";

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden">
        <section>
          <div className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
            <div className="mx-auto flex max-w-6xl flex-col items-center px-6 lg:flex-row lg:items-start lg:justify-between">
              {/* Text content */}
              <div className="max-w-xl text-center lg:text-left lg:w-1/2">
                <h1 className="mt-8 text-balance text-5xl font-medium md:text-6xl xl:text-7xl">
                Faster, better
                </h1>
                <p className="mt-6 text-lg text-pretty">
                  Highly customizable components for building modern websites
                  and applications that look and feel the way you mean it.
                </p>

                <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                  <Button asChild size="lg" className="px-5 text-base">
                    <Link href="#link">
                      <span className="text-nowrap">Start Building</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="px-5 text-base"
                  >
                    <Link href="#link">
                      <span className="text-nowrap">Request a demo</span>
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Responsive video */}
              <div className="w-full max-w-md mb-10 lg:mb-0 lg:w-1/2">
                <video
                  className="w-full h-[400px] object-contain rounded-lg shadow-lg bg-black dark:mix-blend-lighten dark:invert-0"
                  style={{ visibility: "visible" }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/clips/vc23-poster.jpg"
                  aria-label="Animation of the NS product in action"
                  role="Image"
                >
                  <source src="/clips/vc23.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background pb-16 md:pb-32">
          <div className="group relative m-auto max-w-6xl px-6">
            <div className="flex flex-col items-center md:flex-row">
              <div className="md:max-w-44 md:border-r md:pr-6">
                <p className="text-end text-sm">Powering the best teams</p>
              </div>
              <div className="relative py-6 md:w-[calc(100%-11rem)]">
                <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                  <div className="flex">
                    <Image
                      className="mx-auto h-5 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/nvidia.svg"
                      alt="Nvidia Logo"
                      height="20"
                      width={100}
                    />
                  </div>

                  <div className="flex">
                    <Image
                      className="mx-auto h-4 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/column.svg"
                      alt="Column Logo"
                      height="16"
                      width={100}
                    />
                  </div>
                  <div className="flex">
                    <Image
                      className="mx-auto h-4 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/github.svg"
                      alt="GitHub Logo"
                      height="16"
                      width={100}
                    />
                  </div>
                  <div className="flex">
                    <Image
                      className="mx-auto h-5 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/nike.svg"
                      alt="Nike Logo"
                      height="20"
                      width={100}
                    />
                  </div>
                  <div className="flex">
                    <Image
                      className="mx-auto h-5 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                      alt="Lemon Squeezy Logo"
                      height="20"
                      width={100}
                    />
                  </div>
                  <div className="flex">
                    <Image
                      className="mx-auto h-4 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/laravel.svg"
                      alt="Laravel Logo"
                      height="16"
                      width={100}
                    />
                  </div>
                  <div className="flex">
                    <Image
                      className="mx-auto h-7 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/lilly.svg"
                      alt="Lilly Logo"
                      height="28"
                      width={100}
                    />
                  </div>

                  <div className="flex">
                    <Image
                      className="mx-auto h-6 w-fit dark:invert"
                      src="https://html.tailus.io/blocks/customers/openai.svg"
                      alt="OpenAI Logo"
                      height="24"
                      width={100}
                    />
                  </div>
                </InfiniteSlider>

                <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                <ProgressiveBlur
                  className="pointer-events-none absolute left-0 top-0 h-full w-20"
                  direction="left"
                  blurIntensity={1}
                />
                <ProgressiveBlur
                  className="pointer-events-none absolute right-0 top-0 h-full w-20"
                  direction="right"
                  blurIntensity={1}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
