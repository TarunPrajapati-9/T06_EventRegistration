import { z } from "zod";

import { EditEventSchema } from "@/utils/types/zod";
import db from "@/utils/db";
import sendMail from "@/utils/sendMail";

import { adminProcedure, router } from "../trpc";

const eventRouter = router({
  editEvent: adminProcedure
    .input(EditEventSchema)
    .output(z.boolean())
    .mutation(async ({ input }) => {
      try {
        const {
          canvas_image,
          event_date,
          event_description,
          event_name,
          id,
          reg_fees,
          event_capacity,
          organizer_id,
        } = input;
        const res = await db.event.update({
          where: {
            id,
          },
          data: {
            canvas_image,
            event_date: new Date(event_date).toISOString(),
            event_description,
            event_name,
            reg_fees,
            event_capacity,
            organizer_id: organizer_id.toString(),
          },
          select: {
            id: true,
            event_name: true,
            organizer: {
              select: {
                o_name: true,
                o_email: true,
              },
            },
          },
        });

        if (res.id) {
          const subject = `
            <p>Your event <strong>${
              res.event_name
            }</strong> has been updated</p>
            <h3>The changes made by admins are:</h3>
            <ul>
              <li>Event Name: <strong>${event_name}</strong></li>
              <li>Event Date: <strong>${new Date(
                event_date
              ).toDateString()}</strong></li>
              <li>Event Description: <pre><strong>${event_description}</strong></pre></li>
              <li>Registration Fees: <strong>${reg_fees}</strong></li>
              <li>Event capacity: <strong>${event_capacity}</strong></li>
              <li>Canvas Image: 
                <img src='${canvas_image}' alt='${event_name}' />
              </li>
            </ul>
            <p>Please check your dashboard for more details by visiting <a href="https://event-manager-hackoverflow-2024.vercel.app/signin" >here</a></p>
          `;
          await sendMail(
            res.organizer.o_email,
            subject,
            res.organizer.o_name,
            "Eventify - Event Updated!"
          );
          return true;
        }
        return false;
      } catch (error: any) {
        console.error(error.message);
        return false;
      }
    }),
  deleteEvent: adminProcedure
    .input(z.string())
    .output(z.boolean())
    .mutation(async ({ input }) => {
      try {
        const deleted = await db.event.delete({
          where: {
            id: input,
          },
          select: {
            id: true,
            event_name: true,
            organizer: {
              select: {
                o_name: true,
                o_email: true,
              },
            },
          },
        });
        if (deleted) {
          const subject = `
            <p>Your event <strong>${deleted.event_name}</strong> has been deleted due to some reasons. <br/>For more details, please contact admin.</p>            
            `;
          await sendMail(
            deleted.organizer.o_email,
            subject,
            deleted.organizer.o_name,
            "Eventify - Event Deleted!"
          );
          return true;
        }
        return false;
      } catch (error: any) {
        console.error(error.message);
        return false;
      }
    }),
});

export default eventRouter;
