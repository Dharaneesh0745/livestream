from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserRegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    user_type: str
    address: str = None
    latitude: float = None
    longitude: float = None
    industry_type: str = None
    tds_value: float = None
    turbidity_value: float = None
    reports: Optional[List[dict]] = None

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str
