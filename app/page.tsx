import CardSlider from "@/components/CardSlider";
import HeroCarousel from "@/components/HeroCarousel";

export default function Home() {

  return (
     <div>
      <HeroCarousel url="/movie/popular" />
      <CardSlider url="/movie/top_rated" title="Top Rated"  />
      <CardSlider url="/movie/upcoming" title="Upcoming Movies"  />
      <CardSlider url="/movie/now_playing" title="Now Playing"  />
     </div>
  );
}
