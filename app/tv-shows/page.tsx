import CardSlider from "@/components/CardSlider";
import HeroCarousel from "@/components/HeroCarousel";

export default function TVShows() {
    return(
        <div>
            <HeroCarousel url="/tv/popular" />
            <CardSlider url="/tv/top_rated" title="Top Rated" />
            <CardSlider url="/tv/on_the_air" title="On The Air" />
            <CardSlider url="/tv/airing_today" title="Airing Today" />
        </div>
    )
}