import { z } from "zod";
import bcrypt from "bcrypt";

import db from "@/utils/db";
import { AddOrganizerSchema, EditOrganizerSchema } from "@/utils/types/zod";
import sendMail from "@/utils/sendMail";

import { adminProcedure, router } from "../trpc";

const organizerRouter = router({
  updateOrganizer: adminProcedure
    .input(EditOrganizerSchema)
    .output(z.boolean())
    .mutation(async ({ input }) => {
      try {
        const { id, o_name, o_email } = input;
        const id_u = await db.organizer.update({
          where: {
            id,
          },
          data: {
            o_name,
            o_email,
          },
          select: {
            id: true,
            o_name: true,
            o_email: true,
          },
        });
        if (id_u) {
          const subject = `
            <p>Your credentials has been changed</p>
            <p>Name: ${id_u.o_name}</p>
            <p>Email: ${id_u.o_email}</p>
          `;
          await sendMail(
            id_u.o_email,
            subject,
            id_u.o_name,
            "Eventify | Credentials changed!"
          );
          return true;
        } else {
          return false;
        }
      } catch (error: any) {
        console.log(`ERROR AT UPDATE ORGANIZER: ${error.message}`);
        return false;
      }
    }),
  deleteOrganizer: adminProcedure
    .input(z.string())
    .output(z.boolean())
    .mutation(async ({ input }) => {
      try {
        const id_u = await db.organizer.delete({
          where: {
            id: input,
          },
          select: {
            id: true,
            o_name: true,
            o_email: true,
          },
        });
        await db.event.deleteMany({
          where: {
            organizer_id: input,
          },
        });
        if (id_u) {
          const subject = `
            <p>Your account has been deleted as an organizer</p>
            <p>Name: <strong>${id_u.o_name}</strong></p>
            <p>Email: <strong>${id_u.o_email}</strong></p>
          `;
          await sendMail(
            id_u.o_email,
            subject,
            id_u.o_name,
            "Eventify | Account deleted!"
          );
          return true;
        } else {
          return false;
        }
      } catch (error: any) {
        console.log(`ERROR AT DELETE ORGANIZER: ${error.message}`);
        return false;
      }
    }),
  addOrganizer: adminProcedure
    .input(AddOrganizerSchema)
    .output(z.boolean())
    .mutation(async ({ input }) => {
      try {
        const { email, name, password } = input;
        let salt = await bcrypt.genSalt();
        let hash = await bcrypt.hash(password, salt);
        const id_u = await db.organizer.create({
          data: {
            o_email: email,
            o_name: name,
            o_password: hash,
          },
          select: {
            id: true,
            o_name: true,
            o_email: true,
          },
        });
        if (id_u) {
          const subject = `
            <p>We welcome you as an organizer in Eventify <br/>You were added by admin and your credentials are:</p>
            <p>Name: ${id_u.o_name}</p>
            <p>Email: ${id_u.o_email}</p>
            <p>For password please contact admin</p>
          `;
          await sendMail(
            id_u.o_email,
            subject,
            id_u.o_name,
            "Eventify | Welcome!"
          );
          return true;
        } else {
          return false;
        }
      } catch (error: any) {
        console.log(`ERROR AT ADD ORGANIZER: ${error.message}`);
        return false;
      }
    }),
});

export default organizerRouter;
