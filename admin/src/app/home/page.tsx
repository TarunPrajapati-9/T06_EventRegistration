import { Calendar, Users } from "lucide-react";
import Link from "next/link";

const ITEMS = [
  {
    icon: Calendar,
    title: "Events",
    content: "Manage your events",
    link: "/home/events",
  },
  {
    icon: Users,
    title: "Organizers",
    content: "Manage your organizers",
    link: "/home/organizers",
  },
];
const HomePage = () => {
  return (
    <div className="container mx-auto w-full h-full my-40 flex gap-x-10">
      {/* card */}
      {ITEMS.map((item, index) => (
        <div
          className="w-full p-6 border border-gray-600 rounded-lg hover:shadow-lg hover:shadow-gray-800 transition-all duration-300"
          key={item.content + item.link + item.title + index}
        >
          {/* icon and name */}
          <div className="flex items-center gap-x-5">
            <item.icon />
            <h1 className="text-2xl font-bold">{item.title}</h1>
          </div>
          {/* content */}
          <div className="mt-[100px]">
            <p className="text-xl font-bold text-gray-500 my-4">
              {item.content}
            </p>
            <Link href={item.link} className="btn btn-primary">
              Go to {item.title}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
