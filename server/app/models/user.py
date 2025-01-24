from bson import ObjectId
from pydantic import BaseModel, Field
from typing import Optional, List

# Helper class to handle ObjectId in Pydantic
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, field):
        """Custom validator that accepts 'field'."""
        if not ObjectId.is_valid(v):
            raise ValueError(f"Invalid ObjectId: {v}")
        return v

class UserModel(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str
    email: str
    password: str
    user_type: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    industry_type: Optional[str] = None
    tds_value: Optional[float] = None
    turbidity_value: Optional[float] = None
    illegal_records: Optional[List[PyObjectId]] = None
    posted_reports: Optional[List[PyObjectId]] = None

    class Config:
        populate_by_name = True  # Renamed for pydantic v2
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
