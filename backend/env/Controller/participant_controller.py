from fastapi import HTTPException, Body
from fastapi.responses import JSONResponse
from pymongo.results import InsertOneResult
from pymongo.errors import PyMongoError, WriteError
from pydantic import ValidationError
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from config import params
from Model.participants_model import Participant
from Controller.db_init import get_database
from Controller.check_password import verify_password
from Controller.hash_password import hash_password
from bson import ObjectId
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import logging
import jwt

class ParticipantController:

    @classmethod
    async def get_collection(cls) -> AsyncIOMotorDatabase: # type: ignore
        database = await get_database()
        return database

    @staticmethod
    async def convert_object_id_to_str(event):
        event['_id'] = str(event['_id'])
        if 'event_date' in event:
            event['event_date'] = event['event_date'].isoformat()
        return event

    @classmethod
    async def check_participant_exists(cls, participant_email: str) -> bool:
        database = await cls.get_collection()
        try:
            organizer = await database["Participant"].find_one({"p_email": participant_email})
            return organizer is not None
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            return False

    @classmethod
    async def check_registration_exists(cls, participant_id: str, event_id: str) -> bool:
        database = await cls.get_collection()
        try:
            registration = await database["Registration"].find_one({
                "participant_id": participant_id,
                "event_id": event_id
            })
            return registration is not None
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            return False

    @classmethod
    async def check_event_exists(cls, event_id: str) -> bool:
        database = await cls.get_collection()
        try:
            event = await database["Event"].find_one({"_id": ObjectId(event_id) })
            return event is not None
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            return False

    @classmethod
    async def participant_login(cls, data: dict = Body(...)) -> JSONResponse:
        try:
            p_email = data.get("p_email")
            p_password = data.get("p_password")
            collection = await cls.get_collection()
            admin = collection["Participant"]

            email_found = await admin.find_one({"p_email": p_email})
            if email_found:
                print(f"{email_found}")
                password_matched = verify_password(
                    p_password, email_found["p_password"]
                )
                if password_matched:
                    if email_found and isinstance(email_found, dict) and "_id" in email_found:
                        token = jwt.encode(
                            {
                                "_id": str(email_found["_id"]),  # Convert ObjectId to string
                                "exp": datetime.utcnow() + timedelta(minutes=2880),
                            },
                            params["API_KEY"],
                            algorithm="HS256",
                        )
                    return JSONResponse(content={"detail":{"status": True, "token": token}})
                else:
                    raise HTTPException(status_code=401, detail="Incorrect password")
            else:
                raise HTTPException(status_code=404, detail="Incorrect email")
        except IndexError:
            raise HTTPException(status_code=404, detail="Index error")


    @classmethod
    async def view_events(cls) -> JSONResponse:
        try:
            database = await cls.get_collection()
            events_cursor = database["Event"].find({})
            events = [cls.convert_object_id_to_str(event) for event in await events_cursor.to_list(length=None)]

            data = []
            for event_coroutine in events:
                event = await event_coroutine
                organizer_id = event.get("organizer_id")
                if organizer_id:
                    organizer_details = await database["Organizer"].find_one({"_id": ObjectId(organizer_id)}, projection={"o_password":0})
                    # print(organizer_details)
                    if organizer_details:
                        event_data = {
                            "Events": event,
                            "Organizer": await cls.convert_object_id_to_str(organizer_details)
                        }
                        data.append(event_data)

            response_data = {
                "status": True,
                "data": data
            }

            return JSONResponse(content=response_data)

        except ValidationError as validation_error:
            logging.error(f"Validation error: {validation_error}")
            return JSONResponse(content={"detail": {"status": False, "error": "Validation error"}}, status_code=422)

        except PyMongoError as pymono_error:
            logging.error(f"Validation error: {pymono_error}")
            return JSONResponse(content={"detail": {"status": False, "error": "Pymongo error"}}, status_code=422)

        except HTTPException as http_exception:
            logging.error(f"HTTPException: {http_exception}")
            return JSONResponse(content={"detail": {"status": False, "error": "Failed to edit event"}}, status_code=http_exception.status_code)
        except Exception as e:
            logging.error(f"Error retrieving events and organizers: {e}")
            raise HTTPException(status_code=500, detail="Failed to retrieve events and organizers")


    @classmethod
    async def view_registered_event(cls,participant_id:str) -> JSONResponse:
        try:
            try:
                database = await cls.get_collection()
                registrations = await database["Registration"].find({"participant_id":participant_id}).to_list(length=None)

                registrations = [await cls.convert_object_id_to_str(registration) for registration in registrations]

                if registrations:
                    event_ids = [str(registration["event_id"]) for registration in registrations]
                    events = await database["Event"].find({"_id": {"$in": [ObjectId(event_id) for event_id in event_ids]}}).to_list(length=None)

                    events = [await cls.convert_object_id_to_str(event) for event in events]
                    response_data = {
                    "detail": {
                        "status": True,
                        "events": events
                        }
                    }
                    # print("Retrieved events:", events)
                    return JSONResponse(content=response_data)
                else:
                    return JSONResponse(content={"detail": {"status": True, "events":[]}}, status_code=404)

            except Exception as e:
                logging.error(f"Error retrieving events: {e}")
                raise HTTPException(status_code=500, detail="Failed to retrieve events")

        except ValidationError as validation_error:
            logging.error(f"Validation error: {validation_error}")
            return JSONResponse(content={"detail": {"status": False, "error": "Validation error"}}, status_code=422)

        except PyMongoError as pymono_error:
            logging.error(f"Validation error: {pymono_error}")
            return JSONResponse(content={"detail": {"status": False, "error": "Pymongo error"}}, status_code=422)

        except HTTPException as http_exception:
            logging.error(f"HTTPException: {http_exception}")
            return JSONResponse(content={"detail": {"status": False, "error": "Failed to edit event"}}, status_code=http_exception.status_code)
        except Exception as e:
            logging.error(f"Error retrieving events: {e}")
            raise HTTPException(status_code=500, detail="Failed to retrieve events")

    @classmethod
    async def event_register(cls,participant_id:str,event_id:str) -> JSONResponse:
        try:
            try:
                event_exists = await cls.check_event_exists(event_id)
                if not event_exists:
                    return JSONResponse(content={"detail": {"status": False, "error": "Event doesn't exists"}}, status_code=422)

                event_register_data = {
                    "event_id":event_id,
                    "participant_id":participant_id
                }

                database = await cls.get_collection()
                registration_exist = await cls.check_registration_exists(participant_id,event_id)
                if registration_exist:
                    return JSONResponse(content={"detail": {"status": False, "error": "Event Registerd Already"}}, status_code=422)
                event_data = await database["Event"].find_one({"_id":ObjectId(event_id)})
                event_capacity = int(event_data.get("event_capacity"))
                event_dict = {
                    "event_capacity": str(event_capacity - 1)
                }
                if int(event_data.get("event_capacity")) > 0:
                    new_event_register_result: InsertOneResult = await database["Registration"].insert_one(event_register_data)
                    edit_event_result = await database["Event"].update_one(
                        {"_id": ObjectId(event_id)},
                        {"$set": event_dict}
                    )
                    print(edit_event_result)
                else:
                    return JSONResponse(content={"status":False, "errror": f"Capacity is full"}, status_code=500)

                logging.info(f"Insert result: {new_event_register_result}")

                if new_event_register_result.inserted_id is not None:
                    participant_email = await database["Participant"].find_one({"_id":ObjectId(participant_id)})
                    sender_email = params["gmail"]
                    sender_password = "gaqfiuehutkvqejo"

                    # Create the MIME object
                    message = MIMEMultipart()
                    message["From"] =  str(participant_email["p_email"])
                    message["To"] = sender_email
                    message["Subject"] = "You Registered Event Successfully"
                    mail_body = """
                    <!DOCTYPE html>
                    <html>
                    <head></head>
                    <body>
                    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
                        <div style="background-color: #007bff; color: #fff; padding: 20px; text-align: center;">
                        <h1>REGISTRATION CONFIRMATION FOR EVENT REGISTRATION</h1>
                        </div>
                        <div style="padding: 20px;">
                        <p>Dear PARTICIPANT,</p>
                        <p>The post-purchase customer experience is equally important, and email confirmations are a major component of it.
                        Even though sending confirmation emails might seem straightforward, it takes a lot of skill and practice.
                        For that reason, we’ve prepared the ultimate guide for you to get them just right every time.</p>
                        <div style="background-color: #007bff; color: #fff; font-size: 24px; padding: 10px 20px; border-radius: 5px; text-align: center; margin-bottom: 20px;">{event_data}</div>
                        <p>If you did not request , please ignore this email.</p>
                        <p>Thank you for choosing ....</p>
                        <a href="#" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Visit link</a>
                        </div>
                        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px;">
                        <p>Tour and Travels | Address, City, Country | Phone: +91 9725776391 | Email: chapadiyahansil@gmail.com</p>
                        </div>
                    </div>
                    </body>
                    </html>
                    """.format(event_data=event_data.get("event_name"))
                    # Attach body as plain text
                    message.attach(MIMEText(mail_body, "html"))

                    try:
                        # Establish a connection to the SMTP server
                        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                            # Log in to your email account
                            server.login(sender_email, sender_password)

                            # Send the email
                            server.sendmail(sender_email,str(participant_email["p_email"]), message.as_string())

                            response_data = {
                                "detail": {
                                    "status": True,
                                    "_id": str(new_event_register_result.inserted_id),
                                    "message":"Email sent successfully"
                                }
                            }
                        return JSONResponse(content=response_data)
                    except Exception as e:
                        return JSONResponse(content={"error": f"Failed to send email. Error: {str(e)}"}, status_code=500)
                else:
                    raise HTTPException(status_code=500, detail="Failed to register event")

            except Exception as e:
                logging.error(f"Error retrieving events: {e}")
                raise HTTPException(status_code=500, detail="Failed to retrieve events")

        except ValidationError as validation_error:
            logging.error(f"Validation error: {validation_error}")
            return JSONResponse(content={"detail": {"status": False, "error": "Validation error"}}, status_code=422)

        except PyMongoError as pymono_error:
            logging.error(f"Validation error: {pymono_error}")
            return JSONResponse(content={"detail": {"status": False, "error": "Pymongo error"}}, status_code=422)

        except HTTPException as http_exception:
            logging.error(f"HTTPException: {http_exception}")
            return JSONResponse(content={"detail": {"status": False, "error": "Failed to register event"}}, status_code=http_exception.status_code)
        except Exception as e:
            logging.error(f"Error retrieving events: {e}")
            raise HTTPException(status_code=500, detail="Failed to retrieve events")

    @classmethod
    async def register_participant(cls, register_data:dict)->JSONResponse:
        try:
            participant_exists = await cls.check_participant_exists(register_data["p_email"])
            if participant_exists:
                return JSONResponse(content={"detail": {"status": False, "error": "Participant already exists"}}, status_code=422)

            register_data["p_password"] = hash_password(register_data["p_password"])
            registration_model = Participant(**register_data)
            database = await ParticipantController.get_collection()
            new_participant_result: InsertOneResult = await database["Participant"].insert_one(registration_model.dict())

            logging.info(f"Insert result: {new_participant_result}")

            if new_participant_result.inserted_id is not None:
                token = jwt.encode(
                            {
                                "_id": str(new_participant_result.inserted_id),  # Convert ObjectId to string
                                "exp": datetime.utcnow() + timedelta(minutes=2880),
                            },
                            params["API_KEY"],
                            algorithm="HS256",
                        )
                response_data = {
                    "detail": {
                        "status": True,
                        "_id": str(new_participant_result.inserted_id),
                        "token":token
                    }
                }
                return JSONResponse(content=response_data)
            else:
                raise HTTPException(status_code=500, detail="Failed to create event")

        except ValidationError as validation_error:
            logging.error(f"Validation error: {validation_error}")
            return JSONResponse(content={"detail": {"status": False, "error": "Validation error"}}, status_code=422)

        except PyMongoError as pymono_error:
            logging.error(f"Validation error: {pymono_error}")
            return JSONResponse(content={"detail": {"status": False, "error": "Pymongo error"}}, status_code=422)

        except HTTPException as http_exception:
            logging.error(f"HTTPException: {http_exception}")
            return JSONResponse(content={"detail": {"status": False, "error": "Organizer not found"}}, status_code=http_exception.status_code)

        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            return JSONResponse(content={"detail": {"status": False, "error": str(e)}}, status_code=500)

    @classmethod
    async def event_find(cls, event_id:str) -> JSONResponse:
        try:

            database = await ParticipantController.get_collection()
            event_find_result = await database["Event"].find_one({"_id": ObjectId(event_id)})

            event_find_result = await cls.convert_object_id_to_str(event_find_result)

            if event_find_result is not None:
                # print(f"Delete result: {event_find_result}")
                response_data = {
                    "detail": {
                        "status": True,
                        "event": event_find_result
                    }
                }
                return JSONResponse(content=response_data)
            else:
                raise HTTPException(status_code=500, detail="Failed to Retrieve event")
        except ValidationError as validation_error:
            logging.error(f"Validation error: {validation_error}")
            return JSONResponse(content={"detail":{"status": False, "error": "Field is missing",}}, status_code=422) #"detail": validation_error.errors()
        except HTTPException as http_exception:
            logging.error(f"HTTPException: {http_exception}")
            raise
        except WriteError as write_error:
            logging.error(f"MongoDB WriteError: {write_error}")
            return JSONResponse(content={"detail": {"status": False, "error": "MongoDB WriteError"}}, status_code=500)
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            raise HTTPException(status_code=500, detail="Failed to Retrieve event")

    @classmethod
    async def particicpant_find(cls, participant_id:str) -> JSONResponse:
        try:

            database = await ParticipantController.get_collection()
            participant_find_result = await database["Participant"].find_one(
            {"_id": ObjectId(participant_id)},
            projection={"p_password": 0}
        )

            participant_find_result = await cls.convert_object_id_to_str(participant_find_result)

            logging.info(f"Delete result: {participant_find_result}")

            if participant_find_result is not None:
                response_data = {
                    "detail": {
                        "status": True,
                        "participant": participant_find_result
                    }
                }
                return JSONResponse(content=response_data)
            else:
                raise HTTPException(status_code=500, detail="Failed to Retrieve participant")
        except ValidationError as validation_error:
            logging.error(f"Validation error: {validation_error}")
            return JSONResponse(content={"detail":{"status": False, "error": "Field is missing",}}, status_code=422) #"detail": validation_error.errors()
        except HTTPException as http_exception:
            logging.error(f"HTTPException: {http_exception}")
            raise
        except WriteError as write_error:
            logging.error(f"MongoDB WriteError: {write_error}")
            return JSONResponse(content={"detail": {"status": False, "error": "MongoDB WriteError"}}, status_code=500)
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            raise HTTPException(status_code=500, detail="Failed to Retrieve participant")
