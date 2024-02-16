"use server";

import db from "@/utils/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import verifyToken from "./verifyToken";

/**
 * This function runs on server side
 * @param key cookie name to delete
 */
export async function deleteCookie() {
  cookies().delete(process.env.NEXT_PUBLIC_COOKIE_TOKEN_KEY);
}
export async function getEvents() {
  const events = await db.event.findMany();
  const flg = await verifyToken();
  if (!flg) {
    return redirect("/login");
  }
  const filteredEvents = events.map((event) => ({
    ...event,
    event_date: event.event_date.toISOString().split("T")[0],
  }));
  return filteredEvents;
}

export async function getOrganizerById(id: string) {
  try {
    const organizer = await db.organizer.findUnique({
      where: {
        id,
      },
    });
    const flg = await verifyToken();
    if (!flg) {
      return redirect("/login");
    }
    if (organizer) {
      return organizer;
    } else {
      return null;
    }
  } catch (error: any) {
    console.log(`ERROR AT getOrganizerById: ${error.message}`);
    return null;
  }
}

export async function searchEvents(search: string) {
  try {
    let events = [];

    // Check if search string is a valid date
    const searchDate = new Date(search);
    const isSearchDateValid = !isNaN(searchDate.getTime());

    // Check if search string is a valid number for registration fees
    const searchFees = parseFloat(search);
    const isSearchFeesValid = !isNaN(searchFees);

    // Query events based on search criteria
    if (isSearchDateValid && isSearchFeesValid) {
      // Search by both date and fees
      events = await db.event.findMany({
        where: {
          OR: [
            { event_name: { contains: search, mode: "insensitive" } },
            { event_description: { contains: search, mode: "insensitive" } },
            {
              organizer: { o_name: { contains: search, mode: "insensitive" } },
            },
            {
              organizer: { o_email: { contains: search, mode: "insensitive" } },
            },
            { event_date: searchDate },
            { reg_fees: searchFees },
          ],
        },
      });
    } else if (isSearchDateValid) {
      // Search only by date
      events = await db.event.findMany({
        where: {
          OR: [
            { event_name: { contains: search, mode: "insensitive" } },
            { event_description: { contains: search, mode: "insensitive" } },
            {
              organizer: { o_name: { contains: search, mode: "insensitive" } },
            },
            {
              organizer: { o_email: { contains: search, mode: "insensitive" } },
            },
            { event_date: searchDate },
          ],
        },
      });
    } else if (isSearchFeesValid) {
      // Search only by fees
      events = await db.event.findMany({
        where: {
          OR: [
            { event_name: { contains: search, mode: "insensitive" } },
            { event_description: { contains: search, mode: "insensitive" } },
            {
              organizer: { o_name: { contains: search, mode: "insensitive" } },
            },
            {
              organizer: { o_email: { contains: search, mode: "insensitive" } },
            },
            { reg_fees: searchFees },
          ],
        },
      });
    } else {
      // Search without date and fees
      events = await db.event.findMany({
        where: {
          OR: [
            { event_name: { contains: search, mode: "insensitive" } },
            { event_description: { contains: search, mode: "insensitive" } },
            {
              organizer: { o_name: { contains: search, mode: "insensitive" } },
            },
            {
              organizer: { o_email: { contains: search, mode: "insensitive" } },
            },
          ],
        },
      });
    }

    const filteredEvents = events.map((item) => ({
      ...item,
      event_date: item.event_date.toISOString().split("T")[0],
    }));
    return filteredEvents;
  } catch (error: any) {
    console.error(`ERROR AT searchEvents: ${error.message}`);
    return null;
  }
}

export async function getOrganizers() {
  try {
    const flg = await verifyToken();
    if (!flg) {
      return redirect("/login");
    }
    const organizers = await db.organizer.findMany();
    return organizers;
  } catch (error: any) {
    console.error(`ERROR AT getOrganizers: ${error.message}`);
    return [];
  }
}
