from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import Optional
import json

class OurBaseModel(BaseModel):
    class Config:
        orm_mode = True

class Registration(BaseModel):
    _id: Optional[str]  = Field(..., alias='_id', description='The ID of the registration.')
    event_id:str
    participant_id:str


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