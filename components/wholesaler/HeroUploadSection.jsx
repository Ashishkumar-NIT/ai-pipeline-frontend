import Image from "next/image";
import UploadButton from "@/components/wholesaler/UploadButton";

export default function HeroUploadSection() {
  return (
    <section className="relative overflow-hidden  px-6 py-10 md:py-16">
      {/* Background image */}
      <Image
        src="/image/heroframee.png"
        alt=""
        fill
        priority
        aria-hidden
        sizes="100vw"
        className="object-cover"
      />
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl text-center animate-fade-in-up">

        <div className="mt-16">
          <UploadButton />
        </div>
      </div>
    </section>
  );
}
