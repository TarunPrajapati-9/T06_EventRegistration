import type { Organizer } from "@prisma/client";
import { Suspense } from "react";

import { getOrganizers } from "@/actions/actions";
import OrgTable from "./components/OrgTable";
import AddOrganizerModal from "@/components/AddOrganizerModal";

type Props = {
  params: {};
  searchParams: {
    q: string | null;
  };
};

const Organizers: React.FC<Props> = async ({ params, searchParams }) => {
  const organizers = await getOrganizers();
  let organizersFiltered: Organizer[] = [];
  if (searchParams.q !== "" && searchParams.q !== null) {
    organizersFiltered = organizers.filter(
      (org: Organizer) =>
        org.o_name
          .toLowerCase()
          .includes((searchParams.q ?? "").toLowerCase()) ||
        org.o_email.toLowerCase().includes((searchParams.q ?? "").toLowerCase())
    );
  }
  return (
    <div className="flex flex-wrap justify-stretch mt-[50px] gap-6">
      {organizers.length == 0 ? (
        <div className="text-center text-3xl font-semibold">
          No result found
          <span className="divider" />
        </div>
      ) : (
        <table
          className="table table-lg shadow-sm overflow-auto"
          cellPadding={10}
        >
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {organizersFiltered.map((org: Organizer, index: number) => (
              <Suspense
                key={org.id}
                fallback={<span className="skeleton h-4 w-full my-3" />}
              >
                <OrgTable organizer={org} index={index} />
              </Suspense>
            ))}
          </tbody>
        </table>
      )}
      <AddOrganizerModal />
    </div>
  );
};

export default Organizers;
