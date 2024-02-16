from fastapi import HTTPException, Body
from fastapi.responses import JSONResponse
from pymongo.results import InsertOneResult
from pymongo.errors import WriteError, PyMongoError
from pydantic import ValidationError
from motor.motor_asyncio import AsyncIOMotorDatabase
from config import params
from bson import ObjectId
from Model.event_model import Event
from Controller.db_init import get_database
import logging

class EventController:

    @classmethod
    async def get_collection(cls) -> AsyncIOMotorDatabase: # type: ignore
        database = await get_database()
        return database

    @classmethod
    async def check_organizer_exists(cls, organizer_id: str) -> bool:
        database = await cls.get_collection()
        try:
            organizer = await database["Organizer"].find_one({"_id": ObjectId(organizer_id)})
            return organizer is not None
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            return False

    @staticmethod
    def convert_object_id_to_str(event):
        event['_id'] = str(event['_id'])
        event['event_date'] = event['event_date'].isoformat() if 'event_date' in event else None
        return event


    @classmethod
    async def create_event(cls, event_: dict, organizer_id:str) -> JSONResponse:
        try:
            # Check if the organizer exists
            organizer_exists = await cls.check_organizer_exists(organizer_id)
            if not organizer_exists:
                return JSONResponse(content={"detail": {"status": False, "error": "Organizer not found"}}, status_code=422)

            event_["organizer_id"] = str(organizer_id)
            event_model = Event(**event_)
            print(event_model)
            database = await EventController.get_collection()
            new_event_result: InsertOneResult = await database["Event"].insert_one(event_model.dict())

            logging.info(f"Insert result: {new_event_result}")

            if new_event_result.inserted_id is not None:
                response_data = {
                    "detail": {
                        "status": True,
                        "_id": str(new_event_result.inserted_id)
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
    async def delete_event(cls, event_id:str) -> JSONResponse:
        try:

            database = await EventController.get_collection()
            delete_event_result = await database["Event"].delete_one({"_id":ObjectId(event_id)})

            logging.info(f"Delete result: {delete_event_result}")

            if delete_event_result is not None:
                response_data = {
                    "detail": {
                        "status": True,
                        "_id": event_id
                    }
                }
                return JSONResponse(content=response_data)
            else:
                raise HTTPException(status_code=500, detail="Failed to delete event")
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
            raise HTTPException(status_code=500, detail="Failed to delete event")

    @classmethod
    async def edit_event(cls, event_: dict) -> JSONResponse:
        try:
            # Check if the organizer exists
            organizer_exists = await cls.check_organizer_exists(event_["organizer_id"])
            if not organizer_exists:
                return JSONResponse(content={"detail": {"status": False, "error": "Organizer not found"}}, status_code=422)

            event_model = Event(**event_)
            database = await EventController.get_collection()

            edit_event_result = await database["Event"].update_one(
                {"_id": ObjectId(event_["_id"]["$oid"])},
                {"$set": event_model.dict(exclude={"_id"})}
            )

            logging.info(f"Edit result: {edit_event_result}")

            if edit_event_result:
                response_data = {
                    "detail": {
                        "status": True,
                        "_id": str(event_["_id"]["$oid"])
                    }
                }
                return JSONResponse(content=response_data)
            else:
                raise HTTPException(status_code=500, detail="Failed to edit event")

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
            logging.error(f"Unexpected error: {e}")
            return JSONResponse(content={"detail": {"status": False, "error": str(e)}}, status_code=500)

    @classmethod
    async def view_event(cls, organizer_id:str) -> JSONResponse:
        try:
            organizer_exists = await cls.check_organizer_exists((organizer_id))
            if not organizer_exists:
                return JSONResponse(content={"detail": {"status": False, "error": "Organizer not found"}}, status_code=422)
            try:
                database = await cls.get_collection()
                events = await database["Event"].find({"organizer_id": str(organizer_id)}).to_list(length=None)

                events = [cls.convert_object_id_to_str(event) for event in events]

                response_data = {
                    "detail": {
                        "status": True,
                        "events": events
                    }
                }
                print("Retrieved events:", events)
                return JSONResponse(content=response_data)
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
    async def view_participant(cls, organizer_id: str, event_id:str) -> JSONResponse:
        try:
            organizer_exists = await cls.check_organizer_exists((organizer_id))
            if not organizer_exists:
                return JSONResponse(content={"detail": {"status": False, "error": "Organizer not found"}}, status_code=422)

            try:
                database = await cls.get_collection()
                registrations = await database["Registration"].find({"event_id": event_id}).to_list(length=None)
                registrations = [cls.convert_object_id_to_str(registration) for registration in registrations]

                # participant_id = []
                # for participant in events:
                #     participant_id.append(participant["participant_id"])

                # print(participant_id)

                participant_data = []
                for registration in registrations:
                    participant_id = registration.get("participant_id")
                    print(participant_id)
                    if participant_id:
                        participant_ = await database["Participant"].find({"_id": ObjectId(participant_id)}, projection={"p_password":0}).to_list(length=None)
                        print(participant_)
                        if participant_:
                            participant_[0]["_id"] = str(participant_[0]["_id"])
                            participant_data.append((participant_))

                # if events:
                #     event_id = str(events[0]["_id"])

                #     registrations = await database["Registration"].find({"event_id": event_id}).to_list(length=None)
                #     registrations = [cls.convert_object_id_to_str(registration) for registration in registrations]


                #     participant_data = []

                #     for registration in registrations:
                #         participant_id = registration.get("participant_id")
                #         logging.error(f"Validation error: {participant_id}")
                #         if participant_id:
                #             participant = await database["Participant"].find_one({"_id": ObjectId(participant_id)})
                #             if participant:
                #                 participant["_id"] = str(participant["_id"])
                #                 participant_data.append(participant)

                response_data = {
                    "detail": {
                        "status": True,
                        "participants": participant_data
                    }
                }
                return JSONResponse(content=response_data)
            # else:
            #         return JSONResponse(content={"detail": {"status": False, "error": "No events found"}}, status_code=404)

            except Exception as e:
                logging.error(f"Error retrieving participants: {e}")
                raise HTTPException(status_code=500, detail="Failed to retrieve participants")

        except ValidationError as validation_error:
            logging.error(f"Validation error: {validation_error}")
            return JSONResponse(content={"detail": {"status": False, "error": "Validation error"}}, status_code=422)

        except PyMongoError as pymono_error:
            logging.error(f"Validation error: {pymono_error}")
            return JSONResponse(content={"detail": {"status": False, "error": "Pymongo error"}}, status_code=422)

        except HTTPException as http_exception:
            logging.error(f"HTTPException: {http_exception}")
            return JSONResponse(content={"detail": {"status": False, "error": "Failed to process data"}}, status_code=http_exception.status_code)

        except Exception as e:
            logging.error(f"Error retrieving participants: {e}")
            raise HTTPException(status_code=500, detail="Failed to retrieve participants")