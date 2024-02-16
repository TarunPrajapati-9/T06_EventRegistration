from fastapi import HTTPException, Request
from functools import wraps
from config import params
from Controller.db_init import get_database
from response_error import ErrorResponseModel
from bson import ObjectId
import jwt

def get_authenticate_participant(f):
    @wraps(f)
    async def wrapper(request: Request, *args, **kwargs):
        token = request.headers.get('token')
        database = await get_database()

        if not token:
            error_response = ErrorResponseModel(status=False, error="Missing token")
            raise HTTPException(status_code=401, detail=dict(error_response))
        try:
            decoded_token = jwt.decode(token, params['SECRET_KEY'], algorithms=['HS256'])
            _id = decoded_token.get('_id')
            participant_details = await database['Participant'].find_one({"_id": ObjectId(_id)})

            if participant_details and  ObjectId(_id)== participant_details['_id']:
                return await f(request, *args, **kwargs)
            else:
                error_response = ErrorResponseModel(status=False, error="Participant not found")
                raise HTTPException(status_code=401, detail=dict(error_response))
        except jwt.ExpiredSignatureError:
            error_response = ErrorResponseModel(status=False, error="Token expired")
            raise HTTPException(status_code=401, detail=dict(error_response))
        except (jwt.InvalidTokenError, jwt.PyJWTError):
            error_response = ErrorResponseModel(status=False, error="Invalid Token")
            raise HTTPException(status_code=401, detail=dict(error_response))
        except Exception as e:
            error_response = ErrorResponseModel(status=False, error=str(e))
            raise HTTPException(status_code=500, detail=dict(error_response))
    return wrapper