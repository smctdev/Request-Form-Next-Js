import Image from "next/image";
import Logo from "../../public/assets/logo.png";

export default function Footer() {
  return (
    <footer className="py-8 text-white bg-primary">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center rounded-full">
                <Image src={Logo} alt="logo" height={100} width={100}></Image>
              </div>
              <h2 className="text-lg font-bold">SMCT Group of Companies</h2>
            </div>
            <p className="mt-2 text-sm">
              © {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="transition hover:text-secondary">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-secondary">
              Terms of Service
            </a>
            <a href="#" className="transition hover:text-secondary">
              Careers
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
