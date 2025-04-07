import axiosInstance from "@/lib/axios";
import Image from "next/image";
import { notFound } from "next/navigation";

const imageBaseURL = "https://image.tmdb.org/t/p/w500";

export default async function DetailsPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const res = axiosInstance.get(`/movie/${params.id}`);
    const data = (await res).data;

    return (
      <div className="max-w-5xl mx-auto p-4 text-white">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-[300px] relative h-[450px]">
            <Image
              src={
                data.poster_path
                  ? `${imageBaseURL}${data.poster_path}`
                  : "/images/default-image.png"
              }
              alt={data.title || data.name}
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {data.title || data.name}
            </h1>
            <p className="text-secondary mb-4">{data.overview}</p>
            <p>
              <strong>Release Date:</strong>{" "}
              {data.release_date || data.first_air_date}
            </p>
            <p>
              <strong>Rating:</strong> {data.vote_average} / 10
            </p>
            <p>
              <strong>Genres:</strong>{" "}
              {data.genres.map((g: any) => g.name).join(", ")}
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Details fetch error:", error);
    notFound();
  }
}
