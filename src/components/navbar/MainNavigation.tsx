
import { useState } from "react";
import NavbarLogo from "./NavbarLogo";
import NavbarDesktopNav from "./NavbarDesktopNav";
import NavbarMobileButton from "./NavbarMobileButton";
import NavbarMobileMenu from "./NavbarMobileMenu";

export default function MainNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="container flex justify-between items-center py-4">
        {/* Left side - Logo */}
        <NavbarLogo />
        
        {/* Right side - Desktop Navigation */}
        <div className="hidden lg:flex">
          <NavbarDesktopNav />
        </div>
        
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <NavbarMobileButton 
            mobileMenuOpen={mobileMenuOpen} 
            setMobileMenuOpen={setMobileMenuOpen} 
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <NavbarMobileMenu 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
    </>
  );
}
