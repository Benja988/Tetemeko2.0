"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import Navbar from "@/components/Navbar";
import PodCastFooter from "@/components/podcasts/PodCastFooter";
import PodCastSection1 from "@/components/podcasts/PodCastSection1";
import PodCastSection2 from "@/components/podcasts/PodCastSection2";
import PodCastSection3 from "@/components/podcasts/PodCastSection3";
import PodCastSection4 from "@/components/podcasts/PodCastSection4";

export default function PodcastPage() {
 

  return (
    <>
      <Navbar />

      
          

            <PodCastSection1 />
            <PodCastSection2 />
            <PodCastSection3 />
            <PodCastSection4 />
          

      <PodCastFooter />
    </>
  );
}
