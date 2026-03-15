import Footer from "@/components/wholesaler/Footer";

export const metadata = {
  title: "Wholesaler Dashboard",
  description: "Manage your catalogue, orders, and queries.",
};

export default function WholesalerLayout({ children }) {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
}
