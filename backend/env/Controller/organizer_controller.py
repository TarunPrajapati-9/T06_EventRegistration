from fastapi import HTTPException, Body
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from config import params
from Controller.db_init import get_database
from Controller.check_password import verify_password
import jwt


class OrganizerController:

    @classmethod
    async def get_collection(cls) -> AsyncIOMotorDatabase: # type: ignore
        database = await get_database()
        return database

    @classmethod
    async def organizer_login(cls, data: dict = Body(...)) -> JSONResponse:
        try:
            o_email = data.get("o_email")
            o_password = data.get("o_password")
            collection = await cls.get_collection()
            admin = collection["Organizer"]

            email_found = await admin.find_one({"o_email": o_email})
            if email_found:
                password_matched = verify_password(
                    o_password, email_found["o_password"]
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
