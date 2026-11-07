import SectionRenderer from "@/components/sections/SectionRenderer";
import homePageManifest from "@/config/pages/home.manifest";

export default function HomePage() {
  return <SectionRenderer manifest={homePageManifest} />;
}
