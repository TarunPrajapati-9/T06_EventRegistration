from pydantic import BaseModel, Field, validator
from bson import ObjectId
from datetime import datetime
from typing import Optional
import json

class OurBaseModel(BaseModel):
    class Config:
        orm_mode = True

class Event(OurBaseModel):
    _id: Optional[str] = Field(None, alias="_id", description="The ID of the event.")
    event_name: str
    canvas_image: str
    organizer_id: str
    event_description: str
    event_date: datetime
    reg_fees: float
    event_capacity:int

    @validator("_id", pre=True, always=True, check_fields=False)
    def validate_id(cls, value):
        if value:
            try:
                if not ObjectId.is_valid(str(value)):
                    raise ValueError(json.dumps({"status": False, "error": "Invalid ObjectId"}))
                return str(value)
            except Exception as e:
                raise ValueError(json.dumps({"status": False, "error": str(e)}))
        return value

    @validator("event_date", pre=True, always=True)
    def validate_date(cls, value):
        if value:
            try:
                # If it's not already a date, attempt to parse it
                if not isinstance(value, datetime):
                    if "$date" in value:
                        value = datetime.fromisoformat(value["$date"])
                    else:
                        value = datetime.fromisoformat(value)
                return value
            except Exception as e:
                raise ValueError(json.dumps({"status": False, "error": str(e)}))
        return value

