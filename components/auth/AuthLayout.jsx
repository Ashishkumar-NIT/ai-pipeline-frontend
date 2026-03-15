import Image from "next/image";

export function AuthLayout({ children, imageSrc, title, subtitle }) {
  return (
    <div className="flex min-h-screen w-full bg-celestique-cream">
      {/* Left Side - Image */}
      <div className="relative hidden w-1/2 md:block">
        <Image
          src={imageSrc}
          alt="Jewelry"
          fill
          className="object-cover mix-blend-multiply"
          priority
        />
      </div>
      {/* Right Side - Form */}
      <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12 lg:p-16 bg-celestique-cream">
        <div className="mx-auto w-full max-w-md">
          <div>
            <h2 className="mt-6 text-4xl font-serif text-celestique-dark">
              {title}
            </h2>
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-celestique-dark/60">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
