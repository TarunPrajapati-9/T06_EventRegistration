import { Suspense } from "react";
import type { Organizer } from "@prisma/client";

import { getOrganizerById, searchEvents } from "@/actions/actions";
import EventCard from "@/components/EventCard";

type Props = {
  params: {};
  searchParams: {
    q: string | null;
  };
};

const Search = async ({ params, searchParams }: Props) => {
  let events = null;
  let organizer: Organizer[] = [];
  events = await searchEvents(searchParams.q ?? "");
  organizer = await Promise.all(
    (events ?? []).map(
      (item) => getOrganizerById(item.organizer_id) as Promise<Organizer>
    )
  );
  return (
    <div className="flex flex-wrap justify-stretch mt-[50px] gap-3">
      {events?.length == 0 ? (
        <div className="text-center text-3xl font-semibold">
          No result found
          <span className="divider" />
        </div>
      ) : (
        events?.map((event, index) => (
          <Suspense
            key={event.id}
            fallback={<div className="skeleton h-[200px] w-96"></div>}
          >
            <EventCard organizer={organizer[index]} event={event} />
          </Suspense>
        ))
      )}
    </div>
  );
};

export default Search;
