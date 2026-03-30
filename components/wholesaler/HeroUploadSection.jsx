import Image from "next/image";
import UploadButton from "./UploadButton";

export default function HeroUploadSection() {
  return (
    <section className="relative overflow-hidden h-[282px]">
      {/* Background image */}
      <Image
        src="/image/heroframee.png"
        alt=""
        fill
        priority
        aria-hidden
        sizes="100vw"
        className="object-cover [object-position:center_-30%]"
      />
      {/* Content — use pb-X to move button up/down */}
      <div className="relative z-10 h-full flex items-end justify-center pb-11">
        <UploadButton />
      </div>
    </section>
  );
}
